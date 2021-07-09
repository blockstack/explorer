import { Queries } from 'jotai-query-toolkit/nextjs';
import { BlocksListResponse, getBlocksQueryKey } from '@store/blocks';
import { getApiClients } from '@common/api/client';

export const getBlocksPageQueries: Queries = [
  [
    getBlocksQueryKey.confirmed(30),
    async context => {
      const { blocksApi } = await getApiClients(context);
      return (await blocksApi.getBlockList({
        limit: 30,
        offset: 0,
      })) as BlocksListResponse;
    },
  ],
];
