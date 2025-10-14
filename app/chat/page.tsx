import type { Metadata } from "next";
import ChatInterface from "@/app/chat/_components/ChatInterface";

export const metadata: Metadata = {
  title: "AskMyDocs - Chat",
  description: "Chat with the bot about your stored documents.",
};

export default function ChatPage() {
  return <ChatInterface />;
}
