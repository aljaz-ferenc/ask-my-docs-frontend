"use client";

import { SendHorizontal } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { animateScroll } from "react-scroll";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";
import AIMessage from "@/app/chat/_components/AIMessage";
import HumanMessage from "@/app/chat/_components/HumanMessage";
import { queryRAG } from "@/lib/actions";

export default function ChatPage() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [userMessage, setUserMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  async function onSendMessage(query: string) {
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setUserMessage("");
    try {
      setIsThinking(true);
      const result = await queryRAG(query);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.llm_response },
      ]);
    } catch (err) {
      console.log(err);
      toast("Something went wrong. Try again.");
    } finally {
      setIsThinking(false);
    }
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
    <main className=" flex flex-col gap-3 pb-5 !h-[calc(100vh-48px)]">
      <hr />
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSendMessage(userMessage);
        }}
        className="max-w-3xl w-full mx-auto mt-auto flex bg-slate-700 rounded-xl items-center pl-4 pr-3 h-14"
      >
        <input
          className="w-full border-none outline-none focus-visible:!border-none focus-visible:!outline-none focus-visible:!shadow-none focus-visible:!ring-none"
          placeholder="Ask about your docs..."
          onChange={(e) => setUserMessage(e.target.value)}
          value={userMessage}
          disabled={isThinking}
        />
        <button
          type="submit"
          className="hover:bg-primary/80 cursor-pointer bg-primary text-white h-[60%] aspect-square grid place-items-center rounded-full"
        >
          <SendHorizontal size={18} />
        </button>
      </form>
    </main>
  );
}
