import { fetchFromSidecar } from '@common/api/fetch';

export function makeKey(query: string | null, prefix: string): string | null {
  return query !== null ? `${prefix}__${query}` : null;
}

export function extractQueryFromKey(query: string | null, prefix: string): string | null {
  return query ? query.replace(`${prefix}__`, '') : null;
}

export const fetchSearchResults = (apiServer: string) => async (query: string) => {
  const res = await fetchFromSidecar(apiServer)(`/search/${query}`);
  const data = await res.json();
  // this is a workaround for the API not returning data for valid stx addresses
  if (data && data?.found === false && data?.result?.entity_type === 'standard_address') {
    return {
      found: true,
      result: {
        entity_id: query,
        entity_type: 'standard_address',
      },
    };
  }
  return data;
};
