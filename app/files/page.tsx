import { File, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getFilePreviews } from "@/lib/actions";

export default async function FilesPage() {
  const previews = await getFilePreviews();

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
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
        <div className="space-y-4">
          <div className="rounded-lg  shadow-sm">
            <ul className="flex flex-col gap-1">
              {previews.map((file) => (
                <li
                  key={file.fileId}
                  className="bg-slate-800 rounded-md group flex items-center justify-between px-4 py-2 group"
                >
                  <div className="flex items-center gap-3">
                    <span>
                      <File className="text-muted-foreground" />
                    </span>
                    <span className="text-sm text-gray-200">{file.name}</span>
                  </div>
                  <Button
                    type="button"
                    className="cursor-pointer opacity-0 group-hover:opacity-100 hover:!bg-background !bg-transparent"
                    variant="ghost"
                  >
                    <Trash size={18} className="!text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
