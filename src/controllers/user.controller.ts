import bcrypt from "bcryptjs";
import { UserRepository } from "../config/ormconfig";
import { destroyImage, uploadImage } from "../helper/upload-destroy.helper";
import { AuthController } from "./auth.controller";

export class UserController {
	private static userInstance: UserController;

	constructor() {
		if (UserController.userInstance) {
			throw new Error("Use Singleton.instance");
		}
		UserController.userInstance = this;
	}

	public static get getUser() {
		return (
			UserController.userInstance ??
			(UserController.userInstance = new UserController())
		);
	}

	async updateProfile(req, res, next) {
		try {
			const authCtrl = AuthController.getAuth;
			const authUser = await authCtrl.findOneUser(+req.userData.userId);

			const {
				fullName,
				gender,
				birthdate,
				address,
				phone_number,
				linkedInUrl,
				stackoverflowUrl,
			} = req.body;

			await UserRepository.update(
				{ id: authUser.id },
				{
					...(fullName && { name: fullName }),
					...(gender && { gender: gender }),
					...(birthdate && { birthdate: birthdate }),
					...(address && { address: address }),
					...(phone_number && { phone_number: phone_number }),
					...(linkedInUrl && { linked_in: linkedInUrl }),
					...(stackoverflowUrl && { stackoverflow: stackoverflowUrl }),
				}
			);

			const updatedUser = await UserRepository.findOne({
				where: { id: authUser.id },
			});

			return res
				.status(200)
				.json({ success: true, msg: "Profile updated", updatedUser });
		} catch (err) {
			return res
				.status(500)
				.json({ success: false, msg: "Error occured! " + err.message });
		}
	}

	async updatePassword(req, res, next) {
		try {
			const authCtrl = AuthController.getAuth;
			const authUser = await authCtrl.findOneUser(+req.userData.userId);

			const { oldPassword, newPassword } = req.body;

			const compare = await bcrypt.compare(oldPassword, authUser.password);
			if (!compare) {
				return res
					.status(401)
					.json({ success: false, msg: "Incorrect old password!" });
			}

			const salt = await bcrypt.genSalt();
			const hash = await bcrypt.hash(newPassword, salt);

			await UserRepository.update({ id: authUser.id }, { password: hash });

			return res.status(200).json({ success: true, msg: "Password updated" });
		} catch (err) {
			return res
				.status(500)
				.json({ success: false, msg: "Error occured! " + err.message });
		}
	}

	async updateImage(req, res, next) {
		try {
			const authCtrl = AuthController.getAuth;
			const authUser = await authCtrl.findOneUser(+req.userData.userId);

			if ((authUser.cloudinary_id && authUser.imageUrl) || req.file) {
				if (authUser.cloudinary_id && authUser.imageUrl && req.file) {
					await destroyImage(authUser.cloudinary_id);
					authUser.cloudinary_id = "";
					authUser.imageUrl = "";
				}
				if (req.file) {
					const imageResult = await uploadImage(
						req.file.path,
						"dev-articles/users"
					);
					authUser.imageUrl = imageResult.secure_url;
					authUser.cloudinary_id = imageResult.public_id;
				}

				await UserRepository.save(authUser);
			}

			return res
				.status(200)
				.json({ success: true, msg: "Image updated", user: authUser });
		} catch (err) {
			console.log(err);
			return res
				.status(500)
				.json({ success: false, msg: "Error occured! " + err });
		}
	}

	async followUser(req, res, next) {
		const userId = req.params.userId;
		const followerId = req.userData.userId; // Assuming you have a user object in the request representing the follower

		try {
			// Find the user to follow
			const userToFollow = await UserRepository.findOne({
				where: { id: userId },
				relations: ["followers"],
			});
			if (!userToFollow) {
				return res.status(404).json({ success: false, msg: "User not found" });
			}

			const authUser = await UserRepository.findOne({
				where: { id: followerId },
				relations: ["followers"],
			});
			if (!authUser) {
				return res.status(404).json({ success: false, msg: "User not found" });
			}

			if (authUser.id === userToFollow.id) {
				return res
					.status(400)
					.json({ success: false, msg: "You Can't follow yourself" });
			}

			// Check if the user is already followed
			if (
				userToFollow.followers.some((follower) => follower.id === authUser.id)
			) {
				return res
					.status(400)
					.json({ success: false, msg: "User is already followed" });
			}

			// Add the follower
			userToFollow.followers.push(authUser); // Assuming req.user contains the follower user object
			await UserRepository.save(userToFollow);

			return res
				.status(200)
				.json({ success: true, msg: "User followed successfully" });
		} catch (err) {
			console.error(err);
			return res
				.status(500)
				.json({ success: false, msg: "Internal server error" });
		}
	}

	async unfollowUser(req, res, next) {
		const userId = req.params.userId;
		const followerId = req.userData.userId; // Assuming you have a user object in the request representing the follower

		try {
			// Find the user to unfollow
			const userToUnfollow = await UserRepository.findOne({
				where: { id: userId },
				relations: ["followers"],
			});
			if (!userToUnfollow) {
				return res.status(404).json({ success: false, msg: "User not found" });
			}

			const authUser = await UserRepository.findOne({
				where: { id: followerId },
				relations: ["followers"],
			});
			if (!authUser) {
				return res.status(404).json({ success: false, msg: "User not found" });
			}

			if (authUser.id === userToUnfollow.id) {
				return res
					.status(400)
					.json({ success: false, msg: "You Can't unfollow yourself" });
			}

			// Check if the user is already unfollowed
			if (
				!userToUnfollow.followers.some((follower) => follower.id === followerId)
			) {
				return res
					.status(400)
					.json({ success: false, msg: "User is not followed" });
			}

			// Remove the follower
			userToUnfollow.followers = userToUnfollow.followers.filter(
				(follower) => follower.id !== followerId
			);
			await UserRepository.save(userToUnfollow);

			return res
				.status(200)
				.json({ success: true, msg: "User unfollowed successfully" });
		} catch (err) {
			console.error(err);
			return res
				.status(500)
				.json({ success: false, msg: "Internal server error" });
		}
	}

	async isFollow(req, res, next) {
		const userId = req.params.userId;
		const authId = req.userData.userId;

		try {
			const userToUnfollow = await UserRepository.findOne({
				where: { id: userId },
				relations: ["followers"],
			});
			if (!userToUnfollow) {
				return res.status(404).json({ success: false, msg: "User not found" });
			}

			const authUser = await UserRepository.findOne({
				where: { id: authId },
				relations: ["followers"],
			});
			if (!authUser) {
				return res.status(404).json({ success: false, msg: "User not found" });
			}

			const isFollowing = userToUnfollow.followers.some(
				(follower) => follower.id === authId
			);
			return res.status(200).json({ isFollowing });
		} catch (err) {
			console.error(err);
			return res
				.status(500)
				.json({ success: false, msg: "Internal server error" });
		}
	}
}
