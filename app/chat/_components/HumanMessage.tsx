import { motion } from "motion/react";

type HumanMessage = {
  role: string;
  content: string;
};

type HumanMessageProps = {
  message: HumanMessage;
};

export default function HumanMessage({ message }: HumanMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-fit max-w-[80%] flex flex-col gap-1 self-end"
    >
      <span className="text-xs self-end text-muted-foreground">You</span>
      <div className="text-white bg-primary  py-2 px-4 rounded-xl">
        {message.content}
      </div>
    </motion.div>
  );
}
