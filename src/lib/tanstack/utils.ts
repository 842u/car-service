export function queryKeySerialize(queryKey: readonly unknown[]): string {
  return JSON.stringify(queryKey);
}
