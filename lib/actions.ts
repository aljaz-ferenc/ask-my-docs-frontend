"use server";

import { storage } from "@/lib/appwrite";
import type { AIMessage, HumanMessage } from "@/lib/types";

type QueryResult = {
  results: { text: string; metadata: { source: string }; score: number }[];
  llm_response: string;
};

export async function queryRAG(
  query: string,
  recentMessages: (AIMessage | HumanMessage)[],
) {
  const res = await fetch("http://localhost:8000/query", {
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

  try {
    files.forEach((file) => {
      const fileId = crypto.randomUUID();
      filesIds.push(fileId);
      storage.createFile({
        bucketId: process.env.APPWRITE_BUCKET_ID as string,
        fileId: fileId,
        file: file,
      });
    });
  } catch (err) {
    console.error("Error uploading files to Appwrite: ", err);
    throw new Error("Could not upload files.");
  }

  const res = await fetch("http://localhost:8000/add-files", {
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
