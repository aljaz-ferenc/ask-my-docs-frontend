export default function FilesListSkeleton({
  itemsCount = 5,
}: {
  itemsCount?: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: itemsCount }).map((_, index) => (
        <div
          key={`skeleton-file-${index + 1}`}
          className="h-[52px] bg-muted-foreground animate-pulse rounded-lg"
        />
      ))}
    </div>
  );
}
