export function objectToQueryParams(obj: Record<string, string | number | boolean>): string {
  return new URLSearchParams(obj as Record<string, string>).toString();
}
