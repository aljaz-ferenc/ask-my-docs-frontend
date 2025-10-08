import { motion } from "motion/react";
import Markdown from "react-markdown";

type AIMessage = {
  role: string;
  content: string;
};

type AIMessageProps = {
  message: AIMessage;
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
      <div className="text-white py-2 px-4 bg-slate-700 rounded-xl">
        <Markdown>{message.content}</Markdown>
      </div>
    </motion.div>
  );
}
