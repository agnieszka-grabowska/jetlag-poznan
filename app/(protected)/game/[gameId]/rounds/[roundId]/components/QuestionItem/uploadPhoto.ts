import { uploadFile } from "@uploadcare/upload-client";

export async function uploadPhoto(photo: File) {
  const publicKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;

  if (!publicKey) {
    throw new Error("NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY must be set");
  }

  try {
    const result = await uploadFile(photo, {
      publicKey,
      fileName: photo.name,
      contentType: photo.type,
    });

    return result.cdnUrl;
  } catch (err: unknown) {
    console.error("File upload failed:", err);

    throw new Error(err instanceof Error ? err.message : String(err));
  }
}
