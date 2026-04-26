export function getHabitSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace one or more spaces with a single hyphen
    .replace(/[^a-z0-9-]/g, '');    // Remove non-alphanumeric characters except hyphens
}