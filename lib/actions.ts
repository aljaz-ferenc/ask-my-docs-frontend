"use server";

import type { Models } from "appwrite";
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

export async function uploadFiles(files: (File & { id: string })[]) {
  const filesIds: string[] = [];

  // upload files to storage
  try {
    files.forEach((file) => {
      const fileId = crypto.randomUUID();
      filesIds.push(fileId);
      storage.createFile({
        bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string,
        fileId: fileId,
        file: file,
      });
    });
  } catch (err) {
    console.error("Error uploading files to Appwrite: ", err);
    throw new Error("Could not upload files.");
  }

  // send file ids to backend to insert into db
  const res = await fetch(Endpoints.files, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filesIds }),
  });

  if (!res.ok) {
    throw new Error("Could not add files.");
  }

  const data = await res.json();
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

export async function getFilesList() {
  const result = await storage.listFiles({
    bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string,
  });
  return result;
}

export async function getFiles() {
  const fileList = await getFilesList();

  const files: Models.File[] = await Promise.all(
    fileList.files.map(async (file) => {
      const f = await storage.getFile({
        bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string,
        fileId: file.$id,
      });
      return f;
    }),
  );

  return files;
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
