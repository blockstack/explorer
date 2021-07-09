export function getNextPageParam(options: { limit: number; offset: number; total: number }) {
  if (!options) return 0;
  const { limit, offset, total } = options;
  const sum = offset + limit;
  const delta = total - sum;
  const isAtEnd = delta === 0 || Math.sign(delta) === -1;
  if (Math.abs(delta) === sum || isAtEnd) return undefined;
  return sum;
}
