import React from 'react';
import { constructLimitAndOffsetQueryParams } from '@common/api/utils';
import { useSWRInfinite } from 'swr';
import { useApiServer } from '@common/hooks/use-api';

interface UseInfiniteFetch<Data> {
  initialData: Data[];
  limit: number;
  type: 'tx' | 'block';
  pending?: boolean;
  suspense?: boolean;
  types?: string[];
  principal?: string;
}

interface GetKeyOptions {
  index: number;
  type: 'tx' | 'block';
  limit: number;
  pending?: boolean;
  types?: string[];
  apiServer?: string;
  principal?: string;
}

const generateTypesQueryString = (types?: string[]) => {
  if (types?.length) {
    return `&${types
      .map(type => `${encodeURIComponent('type[]')}=${encodeURIComponent(type)}`)
      .join('&')}`;
  }
  return '';
};

export const makeKey = (options: GetKeyOptions) => {
  const { index, type, limit, pending, types, apiServer, principal } = options;
  return `${apiServer as string}/extended/v1/${principal ? `address/${principal}` : ''}${
    principal ? '/transactions' : type
  }${pending ? '/mempool' : ''}?${constructLimitAndOffsetQueryParams(
    limit,
    index + 1 === 1 ? 0 : limit * index + 1
  )}${types ? generateTypesQueryString(types) : ''}`;
};

export function useInfiniteFetch<Data>(
  options: UseInfiniteFetch<Data>
): {
  data: Data[];
  error: any;
  isLoadingInitialData: boolean;
  isLoadingMore: boolean;
  isEmpty: boolean;
  isReachingEnd: boolean;
  isRefreshing: boolean;
  loadMore: () => void;
  refresh: () => void;
} {
  const { limit, initialData, pending, type, principal, types } = options;

  const apiServer = useApiServer();

  const getKey = React.useCallback(
    (options: GetKeyOptions) => {
      return makeKey({
        ...options,
        apiServer,
        principal,
      });
    },
    [principal]
  );

  const fetcher = React.useCallback(
    (url: string) =>
      fetch(url)
        .then(res => res.json())
        .then(({ results }) => results),
    []
  );

  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite<Data>(
    index =>
      getKey({
        index,
        type,
        limit,
        pending,
        types,
      }),
    fetcher,
    {
      initialData,
      initialSize: 1,
      suspense: options?.suspense,
    }
  );

  const combined = data ? [].concat(...(data as any)) : [];

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData || !!(size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = (data?.[0] as any)?.length === 0;
  const isReachingEnd = isEmpty || !!(data && (data[data.length - 1] as any)?.length < limit);
  const isRefreshing = !!(isValidating && data && data.length === size);

  const loadMore = () => setSize(size + 1);
  const refresh = () => mutate();

  return {
    data: combined,
    error,
    isLoadingInitialData,
    isLoadingMore,
    isEmpty,
    isReachingEnd,
    isRefreshing,
    loadMore,
    refresh,
  };
}
