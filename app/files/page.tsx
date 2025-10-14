import { File, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import FileItem from "@/app/files/_components/FileItem";
import { getFilePreviews } from "@/lib/actions";

export const metadata: Metadata = {
  title: "AskMyDocs - All Files",
  description: "Upload your files",
};

export default async function FilesPage() {
  const previews = await getFilePreviews();

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
          {previews.length > 0 && (
            <Link
              href="/upload"
              type="button"
              className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 transition-colors"
            >
              <Plus />
              <span>Add More Files</span>
            </Link>
          )}
        </div>
        {previews.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-white/5 dark:bg-gray-800/20 shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
            <File className="text-muted-foreground" size={50} />
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              No files uploaded
            </h3>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              Get started by uploading your first document.
            </p>
            <Link
              href="/upload"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 transition-colors"
            >
              <Plus />
              <span>Upload Files</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg  shadow-sm">
              <ul className="flex flex-col gap-1">
                {previews.map((file) => (
                  <FileItem file={file} key={file.url} />
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
