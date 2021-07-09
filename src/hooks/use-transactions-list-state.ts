import {
  mempoolTransactionsListState,
  OptionalTransactionAddress,
  transactionsListState,
} from '@store/transactions';
import { DEFAULT_LIST_LIMIT_SMALL, IS_DEV } from '@common/constants';
import { useMemo } from 'react';
import { useAtomDevtools } from '@common/hooks/use-atom-devtools';
import { useInfiniteQueryAtom } from 'jotai-query-toolkit';

export function useTransactionsListState(
  limit = DEFAULT_LIST_LIMIT_SMALL,
  options?: OptionalTransactionAddress
) {
  const anAtom = useMemo(() => transactionsListState([limit, options]), [limit, options]);
  if (IS_DEV) useAtomDevtools(anAtom as any);
  return useInfiniteQueryAtom(anAtom);
}

export function useMempoolTransactionsListState(
  limit = DEFAULT_LIST_LIMIT_SMALL,
  options?: OptionalTransactionAddress
) {
  const anAtom = mempoolTransactionsListState([limit, options]);
  if (IS_DEV) useAtomDevtools(anAtom as any);
  return useInfiniteQueryAtom(anAtom);
}
