export type SourceFileMetadata = {
  source: string;
  file_id: string;
  file_name: string;
};

export type AIMessage = {
  role: "assistant";
  content: string;
  sources?: SourceFileMetadata[];
};

export type HumanMessage = {
  role: "user";
  content: string;
};
