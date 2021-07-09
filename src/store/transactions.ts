import { apiClientsState } from '@store/api-clients';
import {
  atomFamilyWithInfiniteQuery,
  atomFamilyWithQuery,
  makeQueryKey,
} from 'jotai-query-toolkit';

import type { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import type { Getter } from 'jotai';
import type { ApiResponseWithResultsOffset } from '@common/types/api';
import { atom } from 'jotai';
import { QueryFunctionContext, QueryKey } from 'react-query';
import { getNextPageParam } from '@store/common';
import { DEFAULT_POLLING_INTERVAL } from '@common/constants';
import { isPendingTx } from '@common/utils';

// ----------------
// types
// ----------------
export type TransactionsListResponse = ApiResponseWithResultsOffset<Transaction>;
export type MempoolTransactionsListResponse = ApiResponseWithResultsOffset<MempoolTransaction>;
export type OptionalTransactionAddress =
  | { address?: string; recipientAddress?: never; senderAddress?: never }
  | { recipientAddress?: string; address?: never; senderAddress?: never }
  | { senderAddress?: string; recipientAddress?: never; address?: never };

export type LimitWithOptionalAddress = [limit: number, options?: OptionalTransactionAddress];

// ----------------
// keys
// ----------------
export enum TransactionQueryKeys {
  CONFIRMED = 'transactions/CONFIRMED',
  MEMPOOL = 'transactions/MEMPOOL',
  SINGLE = 'transactions/SINGLE',
}

export const getTxQueryKey = {
  confirmed: (limit: number, options?: OptionalTransactionAddress): QueryKey =>
    makeQueryKey(TransactionQueryKeys.CONFIRMED, [limit, options]),
  mempool: (limit: number, options?: OptionalTransactionAddress): QueryKey =>
    makeQueryKey(TransactionQueryKeys.MEMPOOL, [limit, options]),
  single: (txId: string): QueryKey => makeQueryKey(TransactionQueryKeys.SINGLE, txId),
};

// ----------------
// queryFn's
// ----------------
const transactionsListQueryFn = async (
  get: Getter,
  [limit, options = {}]: LimitWithOptionalAddress,
  context: QueryFunctionContext
) => {
  const { transactionsApi } = get(apiClientsState);
  const { pageParam } = context;
  return (await transactionsApi.getTransactionList({
    offset: pageParam,
    limit,
  })) as TransactionsListResponse; // cast due to limitation in api client
};

const mempoolTransactionsListQueryFn = async (
  get: Getter,
  [limit, options = {}]: LimitWithOptionalAddress,
  context: QueryFunctionContext
) => {
  const { transactionsApi } = get(apiClientsState);
  const { pageParam } = context;
  return (await transactionsApi.getMempoolTransactionList({
    offset: pageParam,
    limit,
    ...options,
  })) as MempoolTransactionsListResponse; // cast due to limitation in api client
};
const transactionSingeQueryFn = async (get: Getter, txId: string) => {
  const { transactionsApi } = get(apiClientsState);
  return (await transactionsApi.getTransactionById({
    txId,
  })) as MempoolTransaction | Transaction;
};

// ----------------
// atoms
// ----------------

export const transactionsListState = atomFamilyWithInfiniteQuery<
  LimitWithOptionalAddress,
  TransactionsListResponse
>(TransactionQueryKeys.CONFIRMED, transactionsListQueryFn, {
  getNextPageParam,
  staleTime: DEFAULT_POLLING_INTERVAL * 0.75,
});

export const mempoolTransactionsListState = atomFamilyWithInfiniteQuery<
  LimitWithOptionalAddress,
  MempoolTransactionsListResponse
>(TransactionQueryKeys.MEMPOOL, mempoolTransactionsListQueryFn, {
  getNextPageParam,
  staleTime: DEFAULT_POLLING_INTERVAL * 0.75,
});

export const transactionSingleState = atomFamilyWithQuery<string, MempoolTransaction | Transaction>(
  TransactionQueryKeys.SINGLE,
  transactionSingeQueryFn,
  {
    staleTime: DEFAULT_POLLING_INTERVAL * 0.75,
    getShouldRefetch(initialData) {
      // if it's confirmed, we never need to refetch it
      return isPendingTx(initialData);
    },
  }
);

export const transactionsLimitState = atom(10);
export const transactionsOffsetState = atom(0);

export const transactionsParamsState = atom(get => {
  const limit = get(transactionsLimitState);
  const offset = get(transactionsOffsetState);
  return { limit, offset };
});
