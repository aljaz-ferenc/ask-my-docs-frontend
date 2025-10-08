import { Cog, FileUp, MessagesSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: <FileUp />,
    title: "Upload your files",
    description: "Upload your documents.",
  },
  {
    icon: <Cog />,
    title: "AI processes it",
    description: "Our AI analyzes and understands the content of your files.",
  },
  {
    icon: <MessagesSquare />,
    title: "Chat about the content",
    description:
      "Ask questions and get instant, intelligent answers from your document.",
  },
];

export default function Home() {
  return (
    <main className="flex-grow">
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Chat with your files using AI
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
              Upload your documents and engage in insightful conversations with
              our AI assistant, powered by Retrieval-Augmented Generation (RAG).
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                className={cn([
                  buttonVariants({ variant: "default" }),
                  "text-white",
                ])}
                href="/upload"
              >
                Upload your first file
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              A simple, three-step process to unlock the knowledge in your
              files.
            </p>
          </div>
          <div className="mt-12 relative">
            <div className="grid gap-8 md:grid-cols-3 md:gap-12 relative">
              {steps.map((step, index) => {
                return (
                  <div
                    key={step.title}
                    className="flex flex-col items-center text-center p-6 rounded-xl bg-background-light dark:bg-background-dark border border-transparent dark:border-transparent"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary border-8 border-slate-50 dark:border-slate-900/50 mb-4">
                      <span>{step.icon}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {index + 1}. {step.title}
                    </h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
