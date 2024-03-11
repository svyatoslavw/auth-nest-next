import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getAuthURL = (provider: string): string => {
  return `http://localhost:4000/auth/${provider}-init`
}
