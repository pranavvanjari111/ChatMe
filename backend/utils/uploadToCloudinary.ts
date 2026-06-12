import cloudinary from "../config/cloudinary";

export const uploadImage = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "chatme/profiles" },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      },
    );

    stream.end(buffer);
  });
};
