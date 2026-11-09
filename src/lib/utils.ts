import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in Egyptian Pounds (EGP / ج.م)
 */
export function formatPrice(price: number): string {
  if (isNaN(price)) return "0 ج.م";
  const formatted = new Intl.NumberFormat("ar-EG").format(price);
  return `${formatted} ج.م`;
}

/**
 * Format area in Square Meters (م²)
 */
export function formatArea(area: number): string {
  if (isNaN(area)) return "0 م²";
  const formatted = new Intl.NumberFormat("ar-EG").format(area);
  return `${formatted} م²`;
}

/**
 * Format Arabic date (e.g. ٨ نوفمبر ٢٠٢٦)
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Slugify Arabic or English title
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0621-\u064A-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
