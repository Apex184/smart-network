import { v2 as cloudinary } from 'cloudinary';

import { env } from './config';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_SECRET,
  secure: true,
  sign_url: true,
});

export function generateSignedUploadUrl(publicId: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  const uploadPreset = env.CLOUDINARY_UPLOAD_PRESET;
  const fullPublicId = `${env.CLOUDINARY_PROFILE_PICS_FOLDER}/${publicId}`;

  // Define the parameters for the signed upload URL
  const params = {
    public_id: publicId, // Unique identifier for the uploaded file
    timestamp, // Current timestamp in seconds
    upload_preset: env.CLOUDINARY_UPLOAD_PRESET, // Upload preset,
  } as const;

  // Generate the signature
  const signature = cloudinary.utils.api_sign_request(params, env.CLOUDINARY_SECRET!);

  // Construct the signed URL
  const url = cloudinary.url(fullPublicId, {
    ...params,
    signature,
  });

  return { url, signature, timestamp, uploadPreset, publicId };
}
