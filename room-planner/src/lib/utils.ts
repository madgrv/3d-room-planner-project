// Utility function for conditional className merging (used by SHADCN components)
// Team note: This is the canonical SHADCN 'cn' utility. Do not modify unless updating SHADCN.
import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
