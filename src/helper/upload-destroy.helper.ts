import cloudinaryApi from "../config/cloudinary-api";

export const uploadImage = async (path: string, folder: string) => {
  return await cloudinaryApi.uploader.upload(path, {
    folder,
  });
}

export const destroyImage = async (cloudinary_id: string) => {
  return await cloudinaryApi.uploader.destroy(cloudinary_id, {
    invalidate: true,
    resource_type: "image",
  });
}