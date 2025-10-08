"use client";

import { CircleX, CloudUpload, File, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [
      ...prev,
      ...acceptedFiles.map((file) =>
        Object.assign(file, { id: crypto.randomUUID() }),
      ),
    ]);
  }, []);
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

  async function onUpload() {
    setIsLoading(true);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.message || "Upload failed");
      }

      toast("Files uploaded successfully!");
      setFiles([]);
      setIsCompleted(true);
    } catch (error: unknown) {
      console.log(error);
      const message =
        error instanceof Error ? error.message : "Error uploading files";
      toast(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      {!isCompleted && (
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
                  <div className="flex gap-2 items-center py-3">
                    <File className="text-muted-foreground" />
                    <p>{file.name}</p>
                    <span className="text-muted-foreground ml-auto">
                      {formatBytes(file.size, 2)}
                    </span>
                    <Button
                      variant="link"
                      className="text-muted-foreground/50 text-xs hover:text-destructive cursor-pointer"
                      onClick={() =>
                        setFiles((prev) => prev.filter((f) => f.id !== file.id))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {files.length > 0 && <div className="w-full flex justify-center"></div>}
      {!isCompleted ? (
        <Button
          className="text-white mt-5 text-center flex items-center gap-2 !p-5 cursor-pointer mx-auto"
          type="button"
          onClick={onUpload}
          disabled={isLoading || files.length === 0}
        >
          {!isLoading ? (
            <>
              <Play />
              Process Files
            </>
          ) : (
            <span>Uploading files...</span>
          )}
        </Button>
      ) : (
        <Button onClick={() => router.push("/chat")}>Go to Chat</Button>
      )}
    </div>
  );
}
