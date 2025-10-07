import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import { type NextRequest, NextResponse } from "next/server";
import { addDocsToDB } from "@/app/_vectorStore/chromaDB";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: "No files provided" },
        { status: 400 },
      );
    }

    const docs: Document[] = [];

    for (const file of files) {
      // store file temporary
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "upload-"));
      const tempPath = path.join(tempDir, file.name);
      await fs.writeFile(tempPath, buffer);

      // load file with langchain's loader
      if (file.name.endsWith(".pdf")) {
        const loader = new PDFLoader(tempPath);
        const fileDocs = await loader.load();
        const fileDocsWithId = fileDocs.map((doc) => ({
          ...doc,
          metadata: {
            ...doc.metadata,
            id: crypto.randomUUID(),
            source: file.name,
          },
        }));

        docs.push(...fileDocsWithId);
        await fs.unlink(tempPath);
      }

      if (file.name.endsWith(".txt")) {
        const textDoc = new Document({
          pageContent: await file.text(),
          metadata: { source: file.name, id: crypto.randomUUID() },
        });

        docs.push(textDoc);
      }
    }

    await addDocsToDB(docs);

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: `Something went wrong uploading files. Please try again.` },
      { status: 500 },
    );
  }
}
