"use client";

import { File, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { removeFiles } from "@/lib/actions";
import { cn } from "@/lib/utils";

type FileItemProps = {
  file: {
    fileId: string;
    name: string;
    url: string;
  };
};

export default function FileItem({ file }: FileItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function onRemoveFile() {
    try {
      setIsDeleting(true);
      await removeFiles([file.fileId]);
      toast("File deleted successfully!");
    } catch (err) {
      console.error(err);
      toast("Could not delete the file. Try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <li
      key={file.fileId}
      className="bg-slate-800 rounded-md group flex items-center justify-between px-4 py-2 group"
    >
      <div className="flex items-center gap-3">
        <span>
          <File className="text-muted-foreground" />
        </span>
        <span
          className={cn(
            "text-sm text-gray-200",
            isDeleting && "line-through text-muted-foreground",
          )}
        >
          {file.name}
        </span>
        <span>{isDeleting && <Spinner className="animate-spin" />}</span>
      </div>
      <Button
        type="button"
        className="cursor-pointer opacity-0 group-hover:opacity-100 hover:!bg-background !bg-transparent"
        variant="ghost"
        onClick={onRemoveFile}
        disabled={isDeleting}
      >
        <Trash size={18} className="!text-red-500" />
      </Button>
    </li>
  );
}
