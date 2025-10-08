import { FileUp } from "lucide-react";

export default function FilesPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              All Files
            </h2>
            <p className="mt-1 text-base text-gray-500 dark:text-gray-400">
              Manage your uploaded documents and add more.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          <div className="group relative flex aspect-[3/4] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/20 text-center transition-all duration-300 hover:border-primary hover:bg-primary/10 dark:hover:bg-primary/20">
            <div className="flex flex-col items-center p-4">
              <div className="rounded-full bg-primary/20 p-3 text-primary transition-colors group-hover:bg-primary/30">
                <FileUp />
              </div>
              <p className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Add New File
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Drag &amp; drop or click
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
