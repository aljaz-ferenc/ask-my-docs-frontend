"use client";

import { SendHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { queryRAG } from "@/lib/actions";

export default function ChatPage() {
  const [developerMode, setDeveloperMode] = useState(false);
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

  return (
    <main className="h-screen container flex flex-col gap-3">
      <header className="w-full p-3">
        <label
          htmlFor="devMode"
          className="flex items-center gap-2 ml-auto justify-end"
        >
          Developer Mode
          <Switch
            id="devMode"
            checked={developerMode}
            onCheckedChange={setDeveloperMode}
          />
        </label>
      </header>
      <hr />
      <div className="h-full flex flex-col gap-10">
        {messages.map((message, index) => {
          if (message.role === "user") {
            return <UserMessage message={message} key={`${index + 1}`} />;
          }

          return <AssistantMessage message={message} key={`${index + 1}`} />;
        })}
        {isThinking && <div>Thinking...</div>}
      </div>
      <div className=" mt-auto flex bg-slate-700 rounded-xl items-center pl-4 pr-3 h-14">
        <input
          className="w-full border-none outline-none focus-visible:!border-none focus-visible:!outline-none focus-visible:!shadow-none focus-visible:!ring-none"
          placeholder="Ask about your docs..."
          onChange={(e) => setUserMessage(e.target.value)}
          value={userMessage}
        />
        <button
          type="button"
          className="hover:bg-primary/80 cursor-pointer bg-primary text-white h-[60%] aspect-square grid place-items-center rounded-full"
          onClick={() => onSendMessage(userMessage)}
        >
          <SendHorizontal size={18} />
        </button>
      </div>
    </main>
  );
}

type UserMessage = {
  role: string;
  content: string;
};

type UserMessageProps = {
  message: UserMessage;
};

function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="w-fit max-w-[80%] flex flex-col gap-1 self-end">
      <span className="text-xs self-end text-muted-foreground">You</span>
      <div className="text-white bg-primary  py-2 px-4 rounded-xl">
        {message.content}
      </div>
    </div>
  );
}

type AssistantMessage = {
  role: string;
  content: string;
};

type AssistantMessageProps = {
  message: AssistantMessage;
};

function AssistantMessage({ message }: AssistantMessageProps) {
  return (
    <div className="w-fit max-w-[80%] flex flex-col gap-1 self-start">
      <span className="text-xs self-start text-muted-foreground">
        Assistant
      </span>
      <div className="text-white py-2 px-4 bg-slate-700 rounded-xl">
        {message.content}
      </div>
    </div>
  );
}
