import { atomFamily, atomWithDefault } from 'jotai/utils';
import type { Block } from '@stacks/stacks-blockchain-api-types';
import type { Getter } from 'jotai';
import deepEqual from 'fast-deep-equal';

import { apiClientsState } from '@store/api-clients';

import { ApiResponseWithResultsOffset } from '@common/types/api';
import { QueryRefreshRates } from '@common/constants';
import {
  atomFamilyWithInfiniteQuery,
  atomFamilyWithQuery,
  makeQueryKey,
} from 'jotai-query-toolkit';
import { QueryFunctionContext, QueryKey } from 'react-query';
import { getNextPageParam } from '@store/common';

const paginatedResponseOffset = atomFamily(_key => atomWithDefault(() => 0), deepEqual);

// ----------------
// keys
// ----------------
export enum BlocksQueryKeys {
  CONFIRMED = 'blocks/CONFIRMED',
  SINGLE = 'blocks/SINGLE',
}

export const getBlocksQueryKey = {
  confirmed: (limit: number): QueryKey => makeQueryKey(BlocksQueryKeys.CONFIRMED, limit),
  single: (blockHash: string): QueryKey => makeQueryKey(BlocksQueryKeys.SINGLE, blockHash),
};

// ----------------
// types
// ----------------
export type BlocksListResponse = ApiResponseWithResultsOffset<Block>;

// ----------------
// queryFn's
// ----------------
const blocksListQueryFn = async (get: Getter, limit: number, context: QueryFunctionContext) => {
  const { blocksApi } = get(apiClientsState);
  const { pageParam } = context;
  return (await blocksApi.getBlockList({
    offset: pageParam,
    limit,
  })) as BlocksListResponse; // cast due to limitation in api client
};

const blocksSingleQueryFn = async (get: Getter, hash: string) => {
  const { blocksApi } = get(apiClientsState);
  return (await blocksApi.getBlockByHash({
    hash,
  })) as Block;
};
// ----------------
// atoms
// ----------------
export const blocksListState = atomFamilyWithInfiniteQuery<number, BlocksListResponse>(
  BlocksQueryKeys.CONFIRMED,
  blocksListQueryFn,
  { getNextPageParam: getNextPageParam }
);

export const blocksSingleState = atomFamilyWithQuery<string, Block>(
  BlocksQueryKeys.SINGLE,
  blocksSingleQueryFn,
  // blocks have no reason to refresh, they are pretty static
  { refetchInterval: QueryRefreshRates.None, getShouldRefetch: () => false }
);
