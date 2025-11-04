import { Suspense } from "react";
import Loading from "@/app/_components/Loading";
import MainComponent from "@/app/chat/_components/MainChatComponent";

export default function ChatInterface() {
  return (
    <main className="flex flex-col gap-3 !h-[calc(100vh-48px)]">
      <Suspense fallback={<Loading title="Just a sec..." />}>
        <MainComponent />
      </Suspense>
    </main>
  );
}
