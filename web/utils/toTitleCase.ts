export default function toTitleCase(text?: string): string {
  if(!text) return String(text);
  const titleSplit = text.replaceAll("-", " ").split(" ");
  return titleSplit.reduce((agg, curr) => {
    return `${agg} ${curr.slice(0,1).toUpperCase()}${curr.slice(1)}`;
  }, "")

}