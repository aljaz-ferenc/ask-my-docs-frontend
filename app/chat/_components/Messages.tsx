"use client";

import { SendHorizontal } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { animateScroll } from "react-scroll";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";
import AIMessage from "@/app/chat/_components/AIMessage";
import BotSayHi from "@/app/chat/_components/BotSayHi";
import HumanMessage from "@/app/chat/_components/HumanMessage";
import { queryRAG } from "@/lib/actions";
import type {
  AIMessage as TAIMessage,
  HumanMessage as THumanMessage,
} from "@/lib/types";

export default function Messages() {
  const [messages, setMessages] = useState<(TAIMessage | THumanMessage)[]>([]);
  const [userMessage, setUserMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  function onSendMessage(query: string) {
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setUserMessage("");
    setIsThinking(true);

    const recentMessages = messages.slice(-4);

    queryRAG(query, recentMessages)
      .then((result) => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.llm_response },
        ]);
      })
      .catch((err) => {
        console.error(err);
        toast("Something went wrong. Try again.");
      })
      .finally(() => setIsThinking(false));
  }

  useEffect(() => {
    if (!messages) return;
    animateScroll.scrollToBottom({
      containerId: "messagesContainer",
      duration: 300,
      smooth: true,
    });
  }, [messages]);

  return (
    <div className="h-full flex flex-col gap-2 justify-between">
      <div
        className="overflow-y-auto w-full mx-auto flex flex-col gap-10 p-2"
        id="messagesContainer"
      >
        <BotSayHi />
        <AnimatePresence>
          <div className="max-w-3xl mx-auto w-full flex flex-col gap-10 mb-10">
            {messages.map((message, index) => {
              if (message.role === "user") {
                return <HumanMessage message={message} key={`${index + 1}`} />;
              }

              return <AIMessage message={message} key={`${index + 1}`} />;
            })}
            {isThinking && <BeatLoader color="var(--color-muted-foreground)" />}
          </div>
        </AnimatePresence>
      </div>
      <div className='p-2'>
        <hr className="my-4" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSendMessage(userMessage);
          }}
          className="relative max-w-3xl w-full mx-auto mt-auto flex bg-slate-700 rounded-xl items-center pl-4 pr-3 h-14 mb-3"
        >
          <input
            className="w-full h-full border-none outline-none focus-visible:!border-none focus-visible:!outline-none focus-visible:!shadow-none focus-visible:!ring-none"
            placeholder="Ask about your docs..."
            onChange={(e) => setUserMessage(e.target.value)}
            value={userMessage}
            disabled={isThinking}
          />
          <button
            type="submit"
            className="hover:bg-primary/80 cursor-pointer bg-primary text-white h-[60%] aspect-square grid place-items-center rounded-full"
            disabled={isThinking}
          >
            <SendHorizontal size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
