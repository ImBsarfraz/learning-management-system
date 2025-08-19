import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image or video to Cloudinary
export const uploadMedia = async (filePath, folder) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder,
    });

    // Delete local file after upload
    fs.unlinkSync(filePath);

    return uploadResponse;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null; // let caller handle it
  }
};

// Delete image/media from Cloudinary
export const delete_media = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
  }
};

// Delete video from Cloudinary
export const delete_video = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.error("Cloudinary Video Delete Error:", error);
  }
};
