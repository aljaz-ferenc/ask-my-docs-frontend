"use server";

type QueryResult = {
  results: { text: string; metadata: { source: string }; score: number }[];
  llm_response: string;
};

export async function queryRAG(query: string) {
  const res = await fetch("http://localhost:8000/query", {
    body: JSON.stringify({ query }),
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
