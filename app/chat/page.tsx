"use client";

import { SendHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { animateScroll } from "react-scroll";
import { toast } from "sonner";
import Loading from "@/app/_components/Loading";
import Messages from "@/app/chat/_components/Messages";
import NoFiles from "@/app/chat/_components/NoFiles";
import { getFilePreviews, queryRAG } from "@/lib/actions";
import type {
  AIMessage as TAIMessage,
  HumanMessage as THumanMessage,
} from "@/lib/types";

export default function ChatPage() {
  const [messages, setMessages] = useState<(TAIMessage | THumanMessage)[]>([]);
  const [userMessage, setUserMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [files, setFiles] = useState<
    { fileId: string; name: string; url: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFilePreviews()
      .then((files) => setFiles(files))
      .catch((_err) => {
        throw new Error("Could not load files...");
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function onSendMessage(query: string) {
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setUserMessage("");

    try {
      setIsThinking(true);
      const recentMessages = messages.slice(-4);
      const result = await queryRAG(query, recentMessages);
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
    <main className=" flex flex-col gap-3 !h-[calc(100vh-48px)]">
      <MainComponent
        messages={messages}
        isThinking={isThinking}
        hasFiles={files.length > 0}
        isLoading={isLoading}
      />
      {files.length > 0 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSendMessage(userMessage);
          }}
          className="max-w-3xl w-full mx-auto mt-auto flex bg-slate-700 rounded-xl items-center pl-4 pr-3 h-14 mb-3"
        >
          <input
            className="w-full h-full border-none outline-none focus-visible:!border-none focus-visible:!outline-none focus-visible:!shadow-none focus-visible:!ring-none"
            placeholder="Ask about your docs..."
            onChange={(e) => setUserMessage(e.target.value)}
            value={userMessage}
            disabled={isThinking || files.length === 0}
          />
          <button
            type="submit"
            className="hover:bg-primary/80 cursor-pointer bg-primary text-white h-[60%] aspect-square grid place-items-center rounded-full"
            disabled={isThinking || files.length === 0}
          >
            <SendHorizontal size={18} />
          </button>
        </form>
      )}
    </main>
  );
}

function MainComponent({
  isThinking,
  isLoading,
  messages,
  hasFiles,
}: {
  isLoading: boolean;
  isThinking: boolean;
  messages: (TAIMessage | THumanMessage)[];
  hasFiles: boolean;
}) {
  if (isLoading) {
    return <Loading title="Just a sec..." />;
  }
  if (!hasFiles) {
    return <NoFiles />;
  }

  return <Messages messages={messages} isThinking={isThinking} />;
}
