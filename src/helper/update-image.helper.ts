import { destroyImage, uploadImage } from "./upload-destroy.helper";

export async function updateImageHelper(model, req, uploadPath, image) {

	try {
		if ((model.cloudinary_id && image) || req.file) {
			if (model.cloudinary_id && image && req.file) {
				await destroyImage(model.cloudinary_id);
				model.cloudinary_id = "";
				image = "";
			}
			if (req.file) {
				const imageResult = await uploadImage(uploadPath, req.file.path);
				image = imageResult.secure_url;
				model.cloudinary_id = imageResult.public_id;
			}
		}
	} catch (err) {

	}

}