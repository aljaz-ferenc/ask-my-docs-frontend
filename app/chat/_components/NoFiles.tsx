import { File, Plus } from "lucide-react";
import Link from "next/link";

export default function NoFiles() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <div className="bg-primary/10 dark:bg-primary/20 p-6 rounded-full inline-block mb-6 shadow-md">
          <File className="text-muted-foreground" size={50} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Upload some files
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Upload a file to begin chatting with the AI assistant. Your files
          provide the context for the conversation.
        </p>
        <Link
          href="/upload"
          className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-primary text-white text-sm font-semibold leading-normal shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
        >
          <Plus />
          <span>Upload Your First File</span>
        </Link>
      </div>
    </div>
  );
}
