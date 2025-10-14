import type { Metadata } from "next";
import FileUpload from "@/app/upload/_components/FileUpload";

export const metadata: Metadata = {
  title: "AskMyDocs - Upload Files",
  description: "Upload your files.",
};

export default function UploadPage() {
  return (
    <div className="container md:mt-30 mt-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Upload Your Documents
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          Drag and drop your files or browse to upload.
        </p>
      </div>
      <FileUpload />
    </div>
  );
}
