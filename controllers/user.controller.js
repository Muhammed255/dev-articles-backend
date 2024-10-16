import cloudinaryApi from "../config/cloudinary-api.js";
import User from "../models/user.model.js";

// Follow a user
export const followUser = async (req, res) => {
	try {
		const userId = req.userData.userId; // Authenticated user
		const followUserId = req.params.userId; // User to follow

		if (userId === followUserId) {
			return res
				.status(400)
				.json({ success: false, msg: "You cannot follow yourself." });
		}

		const user = await User.findById(userId);
		const followUser = await User.findById(followUserId);

		if (!followUser) {
			return res
				.status(404)
				.json({ success: false, msg: "User to follow not found." });
		}

		// Check if the user is already following the followUser
		if (user.following.includes(followUserId)) {
			return res
				.status(400)
				.json({ success: false, msg: "You are already following this user." });
		}

		// Add the followUserId to the user's following list and add the userId to the followUser's followers list
		user.following.push(followUserId);
		followUser.followers.push(userId);

		await user.save();
		await followUser.save();

		return res
			.status(200)
			.json({ success: true, msg: "User followed successfully." });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, msg: "Server error." });
	}
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
	try {
		const userId = req.userData.userId;
		const unfollowUserId = req.params.userId;

		const user = await User.findById(userId);
		const unfollowUser = await User.findById(unfollowUserId);

		if (!unfollowUser) {
			return res
				.status(404)
				.json({ success: false, msg: "User to unfollow not found." });
		}

		// Check if the user is not following the unfollowUser
		if (!user.following.includes(unfollowUserId)) {
			return res
				.status(400)
				.json({ success: false, msg: "You are not following this user." });
		}

		// Remove the unfollowUserId from the user's following list and remove the userId from the unfollowUser's followers list
		user.following = user.following.filter(
			(id) => id.toString() !== unfollowUserId
		);
		unfollowUser.followers = unfollowUser.followers.filter(
			(id) => id.toString() !== userId
		);

		await user.save();
		await unfollowUser.save();

		return res
			.status(200)
			.json({ success: true, msg: "User unfollowed successfully." });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, msg: "Server error." });
	}
};

export const updateProfile = async (req, res, _next) => {
	try {
		const userId = req.userData.userId;

		const {
			fullName,
			gender,
			birthdate,
			address,
			phone_number,
			linkedInUrl,
			stackoverflowUrl,
		} = req.body;

		// Find the user by ID and update
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				name: fullName,
				gender,
				birthdate,
				address,
				phone_number,
				linkedInUrl,
				stackoverflowUrl,
			},
			{ new: true, runValidators: true } // `new: true` returns the updated document
		);

		if (!updatedUser) {
			return res.status(404).json({ success: false, msg: "User not found" });
		}

		return res.status(200).json({
			success: true,
			msg: "Profile updated successfully",
			updatedUser,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, msg: "Server error" });
	}
};

export const updatePassword = async (req, res, _next) => {
	try {
		const userId = req.userData.userId;
		const { oldPassword, newPassword } = req.body;

		// Find the user by ID
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ success: false, msg: "User not found" });
		}

		// Validate the old password
		const isMatch = await bcrypt.compare(oldPassword, user.password);
		if (!isMatch) {
			return res
				.status(400)
				.json({ success: false, msg: "Incorrect old password" });
		}

		// Hash the new password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);

		// Update the user's password
		user.password = hashedPassword;
		await user.save();

		return res.status(200).json({ success: true, msg: "Password updated successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, msg: "Server error" });
	}
};

export const updateImage = async (req, res) => {
	try {
		const userId = req.userData.userId;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ success: false, msg: "User not found" });
		}

		// Check if a file was uploaded via Multer
		if (!req.file) {
			return res.status(400).json({ success: false, msg: "No file uploaded" });
		}

		// If the user already has an image, delete the old image from Cloudinary
		if (user.cloudinary_id) {
			await cloudinaryApi.uploader.destroy(user.cloudinary_id);
		}

		// Upload new image to Cloudinary
		const result = await cloudinaryApi.uploader.upload(req.file.path, {
			folder: "dev-articles/users",
			use_filename: true,
		});

		// Update user with new image URL and public_id
		user.imageUrl = result.secure_url;
		user.cloudinary_id = result.public_id;

		await user.save();

		res.json({
			success: true,
			msg: "Image updated successfully",
			user: {
				imageUrl: user.imageUrl,
				cloudinary_id: user.cloudinary_id,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, msg: "Server error" });
	}
};

// Check if the user is following another user
export const isFollow = async (req, res) => {
	try {
		const userId = req.userData.userId;
		const followUserId = req.params.userId;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ success: false, msg: "User not found." });
		}

		const isFollowing = user.following.includes(followUserId);

		return res.status(200).json({ isFollowing });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, msg: "Server error." });
	}
};
