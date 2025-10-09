import { PuffLoader } from "react-spinners";

type LoadingProps = {
  title?: string;
  description?: string;
};

export default function Loading({ title, description }: LoadingProps) {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-xl p-8 backdrop-blur-sm">
        <PuffLoader color="var(--color-muted-foreground)" />
        <div className="flex flex-col items-center gap-2 text-center">
          {title && (
            <h2 className="text-xl font-semibold text-[#101622] dark:text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-white/60">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
