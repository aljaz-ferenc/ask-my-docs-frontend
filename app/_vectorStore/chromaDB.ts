import type { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

const embeddingModel = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});
export const vectorStore = new MemoryVectorStore(embeddingModel);
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkOverlap: 200,
  chunkSize: 1000,
});

export async function addDocsToDB(docs: Document[]) {
  const chunks = await textSplitter.splitDocuments(docs);
  const docsEmbeddings = await embeddingModel.embedDocuments(
    chunks.map((chunk) => chunk.pageContent),
  );
  await vectorStore.addVectors(docsEmbeddings, chunks);
}
