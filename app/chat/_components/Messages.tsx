import { AnimatePresence } from "motion/react";
import { BeatLoader } from "react-spinners";
import AIMessage from "@/app/chat/_components/AIMessage";
import HumanMessage from "@/app/chat/_components/HumanMessage";
import type {
  AIMessage as TAIMessage,
  HumanMessage as THumanMessage,
} from "@/lib/types";

type MessagesProps = {
  messages: (TAIMessage | THumanMessage)[];
  isThinking: boolean;
};

export default function Messages({ messages, isThinking }: MessagesProps) {
  return (
    <div className="h-screen overflow-y-auto" id="messagesContainer">
      <div className="max-w-3xl w-full mx-auto flex flex-col gap-10 ">
        <AnimatePresence>
          {messages.map((message, index) => {
            if (message.role === "user") {
              return <HumanMessage message={message} key={`${index + 1}`} />;
            }

            return <AIMessage message={message} key={`${index + 1}`} />;
          })}
        </AnimatePresence>
        {isThinking && <BeatLoader color="var(--color-muted-foreground)" />}
      </div>
    </div>
  );
}
