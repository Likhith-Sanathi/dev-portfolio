import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// The custom type scale in globals.css. Without this, tailwind-merge reads
// `text-display` as a colour and drops whichever colour class shares a cn().
const twMerge = extendTailwindMerge({
  extend: { theme: { text: ["lead", "title", "display", "poster", "giant"] } },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function pad(value: number) {
  return String(value).padStart(2, "0")
}
