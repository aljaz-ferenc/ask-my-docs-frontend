"use client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
if (!BASE_URL) throw new Error("Missing BASE_URL env");

import { SendHorizontal } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { animateScroll } from "react-scroll";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";
import AIMessage from "@/app/chat/_components/AIMessage";
import BotSayHi from "@/app/chat/_components/BotSayHi";
import HumanMessage from "@/app/chat/_components/HumanMessage";
import type {
  SourceFileMetadata,
  AIMessage as TAIMessage,
  HumanMessage as THumanMessage,
} from "@/lib/types";

export default function Messages() {
  const [messages, setMessages] = useState<(TAIMessage | THumanMessage)[]>([]);
  const [userMessage, setUserMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const sourcesRef = useRef<SourceFileMetadata[] | null>(null);

  function onSendMessage(query: string) {
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setUserMessage("");
    setIsThinking(true);
    sourcesRef.current = null;

    const recentMessages = messages.slice(-4);

    const es = new EventSource(
      `${BASE_URL}/query/?query=${query}&recent_messages=${encodeURIComponent(
        JSON.stringify(recentMessages),
      )}`,
    );

    es.addEventListener("metadata", (e) => {
      const metadata = JSON.parse(e.data) as SourceFileMetadata[];

      const duplicates = new Set<SourceFileMetadata["file_id"]>();
      const deduped = metadata.filter((md) => {
        if (duplicates.has(md.file_id)) return false;

        duplicates.add(md.file_id);
        return true;
      });

      sourcesRef.current = deduped;
    });

    es.addEventListener("done", () => {
      setIsThinking(false);
      es.close();
      return;
    });

    es.addEventListener("token", (e) => {
      setIsThinking(false);

      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];

        if (!lastMessage || lastMessage.role !== "assistant") {
          return [
            ...prev,
            {
              role: "assistant",
              content: e.data,
              sources: sourcesRef.current,
            } as TAIMessage,
          ];
        }

        return [
          ...prev.slice(0, -1),
          {
            role: "assistant",
            content: lastMessage.content + e.data,
            sources: sourcesRef.current,
          } as TAIMessage,
        ];
      });
    });

    es.onerror = (err) => {
      console.error("SSE error:", err);
      toast("Streaming failed. Try again.");
      setIsThinking(false);
      es.close();
    };
  }

  useEffect(() => {
    if (!messages) return;
    animateScroll.scrollToBottom({
      containerId: "messagesContainer",
      duration: 0,
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
      <div className="p-2">
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
