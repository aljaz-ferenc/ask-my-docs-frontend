import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import FilesList from "@/app/chat/_components/FilesList";
import FilesListSkeleton from "@/app/chat/_components/FilesListSkeleton";

export const metadata: Metadata = {
  title: "AskMyDocs - All Files",
  description: "Upload your files",
};

export default async function FilesPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 h-full">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              All Files
            </h2>
            <p className="mt-1 text-base text-gray-500 dark:text-gray-400">
              Manage your uploaded documents and add more.
            </p>
          </div>
          <Link
            href="/upload"
            type="button"
            className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 transition-colors"
          >
            <Plus />
            <span>Add More Files</span>
          </Link>
        </div>
        <Suspense fallback={<FilesListSkeleton />}>
          <FilesList />
        </Suspense>
      </div>
    </main>
  );
}
