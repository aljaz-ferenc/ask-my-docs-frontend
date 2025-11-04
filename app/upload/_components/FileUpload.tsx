"use client";

import {
  Check,
  CircleX,
  CloudUpload,
  File,
  RotateCcw,
  Trash,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  processFile,
  removeFileFromStorage,
  revalidatePathFromClient,
} from "@/lib/actions";
import { uploadFile } from "@/lib/functions/uploadFile";
import { cn, formatBytes } from "@/lib/utils";

const ErrorMessageMap = {
  "file-invalid-type": "File type must be one of .txt or .pdf",
  "file-too-large": "File is larger that 5MB",
} as const;

export default function FileUpload() {
  const router = useRouter();
  const [files, setFiles] = useState<(File & { id: string })[]>([]);
  const [errors, setErrors] = useState<{ message: string; fileName: string }[]>(
    [],
  );
  const [completed, setCompleted] = useState<string[]>([]);
  const [failed, setFailed] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [
      ...prev,
      ...acceptedFiles.map((file) =>
        Object.assign(file, { id: crypto.randomUUID() }),
      ),
    ]);
  }, []);

  const allFilesUploaded =
    files.every((f) => completed.includes(f.id)) && files.length > 0;
  const allFIlesAttempted =
    files.every((f) => completed.includes(f.id) || failed.includes(f.id)) &&
    files.length > 0;
  const allFilesFailed =
    files.every((f) => failed.includes(f.id)) && files.length > 0;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((rejection) => {
        setErrors((prev) => [
          ...prev,
          {
            message:
              ErrorMessageMap[
                rejection.errors[0].code as
                  | "file-invalid-type"
                  | "file-too-large"
              ],
            fileName: rejection.file.name,
          },
        ]);
      });
    },
    onDragEnter: () => {
      setErrors([]);
    },
    maxSize: 5 * 1024 * 1024,
  });

  async function onUpload(fileId?: string) {
    setFailed([]);
    setIsLoading(true);
    const failedFiles = [];
    const completedFiles = [];

    try {
      for (const file of files) {
        if (completed.includes(file.id)) continue;
        if (fileId) {
          if (file.id !== fileId) continue;
        }
        try {
          const uploadResult = await uploadFile(file);

          if (uploadResult.status !== "success") {
            setFailed((prev) => [...prev, uploadResult.fileId]);
            throw new Error("Could not upload file");
          }

          const processResult = await processFile(uploadResult.fileId);

          if (processResult.status === "success") {
            setCompleted((prev) => [...prev, processResult.fileId]);
            completedFiles.push(file.id);
            continue;
          }

          await removeFileFromStorage(file.id);
          failedFiles.push(processResult.fileId);
          setFailed((prev) => [...prev, processResult.fileId]);
        } catch (err) {
          if (err) {
            console.error(`Error uploading or processing file: ${err}`);
          }
        }
      }
    } finally {
      await revalidatePathFromClient("/files");
      setIsLoading(false);
    }

    if (failedFiles.length) {
      toast(
        `Failed to upload ${failedFiles.length} ${failedFiles.length === 1 ? "file" : "files"}.`,
      );
    }

    if (completedFiles.length) {
      toast(
        `${completedFiles.length} ${completedFiles.length === 1 ? "file" : "files"} processed successfully!`,
      );
    }
  }

  return (
    <div>
      <div className="bg-slate-800/40 p-7 rounded-[1.5rem]">
        <Card
          className={cn([
            "bg-slate-800 border-2 border-slate-700 border-dashed text-center mb-5 transition-colors",
            isDragActive && "border-accent border-solid bg-accent/10",
          ])}
        >
          <CardContent
            {...getRootProps({
              className:
                "md:h-64 h-30 flex flex-col items-center justify-center p-0",
            })}
          >
            {errors.length > 0 ? (
              <CircleX
                size={40}
                style={{ color: "#fb2c36" }}
                className="mb-3"
              />
            ) : (
              <CloudUpload size={40} className="text-muted-foreground" />
            )}
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <div>
                {errors.length > 0 ? (
                  <div>
                    {errors.map((error, index) => (
                      <div
                        key={`${error.message}-${error.fileName}-${index + 1}`}
                        className="mb-3"
                      >
                        <p className="text-destructive text-sm">
                          <span className="font-bold">File Rejected: </span>
                          <span className="text-destructive/80">
                            {error.fileName.slice(0, 20)}...
                          </span>
                        </p>
                        <p
                          className="text-destructive text-sm"
                          key={`${error.message}-${error.fileName}-${index}`}
                        >
                          {error.message}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    <p>Drop the files here or click to select files</p>
                    <p>PDF, TXT (MAX. 5MB)</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        {files.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-5">Uploaded Files</h3>
            {files.map((file) => (
              <div className="group" key={file.id}>
                <div className="flex gap-2 justify-between items-center py-3">
                  <div className="flex items-center gap-2">
                    <File className="text-muted-foreground" />
                    <p className="mr-auto">{file.name}</p>
                  </div>

                  {!isLoading &&
                    !completed.includes(file.id) &&
                    !failed.includes(file.id) && (
                      <div className="flex gap-3 items-baseline">
                        <span className="text-muted-foreground ml-auto">
                          {formatBytes(file.size, 2)}
                        </span>
                        <button
                          type="button"
                          className="text-muted-foreground/50 text-xs hover:text-destructive cursor-pointer font-semibold"
                          onClick={() =>
                            setFiles((prev) =>
                              prev.filter((f) => f.id !== file.id),
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  {isLoading &&
                    !completed.includes(file.id) &&
                    !failed.includes(file.id) && <Spinner />}
                  {completed.includes(file.id) && <Check color="green" />}
                  {failed.includes(file.id) && (
                    <>
                      <X
                        color="var(--color-destructive)"
                        className="group-hover:hidden ml-auto"
                      />
                      <div className="flex gap-4">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="text-muted-foreground text-xs hidden group-hover:block hover:underline"
                              onClick={() => onUpload(file.id)}
                            >
                              <RotateCcw
                                size={15}
                                className="hover:text-white cursor-pointer"
                              />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Retry</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="text-muted-foreground text-xs hidden group-hover:block  hover:underline"
                              onClick={() => {
                                console.log(file.id);
                                setFiles((prev) =>
                                  prev.filter((f) => f.id !== file.id),
                                );
                              }}
                            >
                              <Trash
                                size={15}
                                className="hover:text-white cursor-pointer"
                              />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Remove</TooltipContent>
                        </Tooltip>
                      </div>
                    </>
                  )}
                </div>
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
      <Button
        onClick={
          allFIlesAttempted && completed.length > 0
            ? () => router.push("/chat")
            : () => onUpload()
        }
        disabled={isLoading || files.length === 0}
        className="max-w-50 w-full mt-3 text-white cursor-pointer"
      >
        <ActionButtonContent
          allFilesCompleted={allFilesUploaded}
          allFilesFailed={allFilesFailed}
          allFilesAttemped={allFIlesAttempted}
          isLoading={isLoading}
        />
      </Button>
    </div>
  );
}

function ActionButtonContent({
  allFilesFailed,
  allFilesCompleted,
  allFilesAttemped,
  isLoading,
}: {
  isLoading: boolean;
  allFilesCompleted: boolean;
  allFilesAttemped: boolean;
  allFilesFailed: boolean;
}) {
  if (isLoading) {
    return <Spinner color="white" />;
  }

  if (allFilesFailed) {
    return <span>Retry</span>;
  }

  if (allFilesAttemped || allFilesCompleted) {
    return <span>Go to Chat</span>;
  }

  return <span>Process Files</span>;
}
