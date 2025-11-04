import { File, Plus } from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import FileItem from "@/app/files/_components/FileItem";
import { getFilePreviews } from "@/lib/actions";

export default async function FilesList() {
  "use cache";
  cacheLife("hours");
  cacheTag("files-list");
  const files = await getFilePreviews();

  if (files.length === 0) {
    return (
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
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg  shadow-sm">
        <ul className="flex flex-col gap-1">
          {files.map((file) => (
            <FileItem file={file} key={file.url} />
          ))}
        </ul>
      </div>
    </div>
  );
}
