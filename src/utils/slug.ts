/**
 * Generates a URL-friendly slug from a string.
 * @param text The text to slugify.
 * @returns The generated slug.
 */
export const generateSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove accent marks
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/-+/g, "-"); // Replace multiple dashes with a single dash
};
