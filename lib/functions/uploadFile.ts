import { storage } from "@/lib/appwrite";

export async function uploadFile(file: File & { id: string }) {
  try {
    const uploadedFile = await storage.createFile({
      bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string,
      fileId: file.id,
      file: file,
    });
    return { status: "success", fileId: uploadedFile.$id } as {
      status: "success" | "error";
      fileId: string;
    };
  } catch (error: unknown) {
    console.error("Uploading failed:", error);
    return { status: "error", fileId: file.id } as {
      status: "success" | "error";
      fileId: string;
    };
  }
}
