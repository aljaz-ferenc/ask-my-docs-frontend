import { motion } from "motion/react";
import Markdown from "react-markdown";
import type { AIMessage as TAIMessage } from "@/lib/types";

export type AIMessageProps = {
  message: TAIMessage;
};

export default function AIMessage({ message }: AIMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-fit max-w-[80%] flex flex-col gap-1 self-start "
    >
      <span className="text-xs self-start text-muted-foreground">
        Assistant
      </span>
      <div className="text-white py-2 px-4 bg-slate-700 rounded-xl text-sm">
        <Markdown>{message.content}</Markdown>
      </div>
      {message.sources && message.sources.length > 0 && (
        <div className="text-xs self-start mt-1 text-muted-foreground">
          <span className="text-white">
            {message.sources.length > 1 ? "Sources" : "Source"}
          </span>
          <ul className="flex gap-3 w-full flex-wrap">
            {message.sources.map((source, index) => (
              <li key={`source-${index + 1}`}>{source.file_name}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
