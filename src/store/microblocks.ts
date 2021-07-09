import { Microblock } from '@stacks/stacks-blockchain-api-types';
import { Getter } from 'jotai';
import { atomFamilyWithQuery, makeQueryKey, QueryRefreshRates } from 'jotai-query-toolkit';
import { QueryKey } from 'react-query';
import { apiClientsState } from './api-clients';

// ----------------
// keys
// ----------------
export enum MicroblocksQueryKeys {
  SINGLE = 'microblocks/SINGLE',
}

export const getMicroblocksQueryKey = {
  single: (microblockHash: string): QueryKey =>
    makeQueryKey(MicroblocksQueryKeys.SINGLE, microblockHash),
};

// ----------------
// queryFn's
// ----------------
const microblocksSingleQueryFn = async (get: Getter, hash: string) => {
  const { microblocksApi } = get(apiClientsState);
  return (await microblocksApi.getMicroblockByHash({
    hash,
  })) as Microblock;
};

// ----------------
// atoms
// ----------------
export const microblocksSingleState = atomFamilyWithQuery<string, Microblock>(
  MicroblocksQueryKeys.SINGLE,
  microblocksSingleQueryFn,
  // do microblocks need to refresh?
  { refetchInterval: QueryRefreshRates.None, getShouldRefetch: () => false }
);
