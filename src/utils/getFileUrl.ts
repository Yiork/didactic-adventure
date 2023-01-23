import { randomUUID } from "crypto";
import cloudinary from "cloudinary";

export const allowed_formats = ["jpeg", "png", "gif", "webp"];

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getFileUrl = async (file: string, name: string) => {
  try {
    const uniqId = randomUUID();

    const uploaded = await cloudinary.v2.uploader.upload(file, {
      folder: "ai-assets",
      allowed_formats,
      public_id: `${name}-${uniqId}`,
    });

    return uploaded?.secure_url;
  } catch (err) {
    console.log(err);
  }
};
