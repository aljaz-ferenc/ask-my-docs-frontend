"use server";

import { revalidatePath } from "next/cache";
import { storage } from "@/lib/appwrite";
import { Endpoints } from "@/lib/endpoints";
import type { AIMessage, HumanMessage } from "@/lib/types";

type QueryResult = {
  results: { text: string; metadata: { source: string }; score: number }[];
  llm_response: string;
};

export async function queryRAG(
  query: string,
  recentMessages: (AIMessage | HumanMessage)[],
) {
  const res = await fetch(Endpoints.query, {
    body: JSON.stringify({ query, recentMessages }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!res.ok) {
    const r = await res.json();
    throw new Error(r.message || "Querying failed");
  }

  const data: QueryResult = await res.json();
  return data;
}

export async function processFile(fileId: string) {
  try {
    const res = await fetch(Endpoints.files, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filesIds: [fileId] }),
    });

    if (!res.ok) {
      throw new Error("Could not upload files.");
    }

    const data: { status: "success" | "error"; fileId: string } =
      await res.json();
    return data;
  } catch (error) {
    console.error("Error processing files:", error);
    await removeFiles([fileId]);
    revalidatePath("/files");
    throw new Error("Could not process file...");
  }
}

export async function removeFileFromDB(fileId: string) {
  const res = await fetch(Endpoints.files, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filesIds: [fileId] }),
  });

  if (!res.ok) {
    console.error("Error deleting files from DB");
  }
  revalidatePath("/files");
  const data: { status: "success" | "error"; fileId: string } =
    await res.json();
  return data;
}

export async function removeFiles(filesIds: string[]) {
  try {
    await Promise.all(
      filesIds.map((id) =>
        storage.deleteFile({
          bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string,
          fileId: id,
        }),
      ),
    );

    const res = await fetch(Endpoints.files, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filesIds }),
    });

    if (!res.ok) {
      console.error("Error deleting files from DB");
    }
    revalidatePath("/files");

    return await res.json();
  } catch (err) {
    console.error(err);
    throw new Error("Could not delete files. Please try again.");
  }
}

export async function removeFileFromStorage(fileId: string) {
  try {
    await storage.deleteFile({
      bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string,
      fileId,
    });
  } catch (err: unknown) {
    console.error("Error removing files from storage:", err);
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("Error removing files from storage");
  }
}

export async function getFilesList() {
  return await storage.listFiles({
    bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string,
  });
}

export async function getFilePreviews() {
  const fileList = await getFilesList();

  const previews: { fileId: string; name: string; url: string }[] =
    fileList.files.map((file) => {
      const url = storage.getFileView({
        bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string,
        fileId: file.$id,
      });

      return {
        fileId: file.$id,
        name: file.name,
        url,
      };
    });

  return previews;
}

export async function revalidatePathFromClient(path: string) {
  revalidatePath(path);
}
