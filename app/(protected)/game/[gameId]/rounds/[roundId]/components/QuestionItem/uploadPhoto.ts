"use server";
import { uploadFile } from "@uploadcare/upload-client";

export async function uploadPhoto(photo: File) {
  const publicKey = process.env.UPLOADCARE_PUBLIC_KEY;

  if (!publicKey) {
    throw new Error("UPLOADCARE_PUBLIC_KEY must be set");
  }
  const buffer = Buffer.from(await photo.arrayBuffer());

  let result;

  try {
    result = await uploadFile(buffer, {
      publicKey,
      fileName: photo.name,
      contentType: photo.type,
    });
  } catch (err: unknown) {
    console.error("File upload failed:", err);

    throw new Error(err instanceof Error ? err.message : String(err));
  }

  return result.cdnUrl;
}
