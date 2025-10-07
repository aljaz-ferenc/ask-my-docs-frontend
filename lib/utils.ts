import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatBytes = (bytes: number, precision = 2) => {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  if (bytes < 1024) return `${bytes} B`;

  const unitIndex = Math.floor(Math.log10(bytes) / Math.log10(1024));
  const value = bytes / 1024 ** unitIndex;

  return `${value.toFixed(precision).replace(/\.?0+$/, "")} ${units[unitIndex]}`;
};
