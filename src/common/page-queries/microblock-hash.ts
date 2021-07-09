import { NextPageContext } from 'next';
import { queryWith0x } from '@common/utils';
import { GetQueries, getSingleCachedQueryData, Queries } from 'jotai-query-toolkit/nextjs';
import { Microblock } from '@stacks/stacks-blockchain-api-types';
import { getApiClients } from '@common/api/client';
import { getTxQueryKey } from '@store/transactions';
import { getMicroblocksQueryKey } from '@store/microblocks';
import { QueryClient } from 'react-query';
import { getBlocksQueryKey } from '@store/blocks';

export function getMicroblockHashFromCtx(ctx: NextPageContext) {
  const { query } = ctx;
  if (!query?.hash) throw Error('No microblock hash');
  return queryWith0x(query?.hash?.toString());
}

function getMicroblockPageCachedQueryProps(ctx: NextPageContext, queryClient: QueryClient) {
  const microblockHash = getMicroblockHashFromCtx(ctx);
  const queryKey = getMicroblocksQueryKey.single(microblockHash);
  return getSingleCachedQueryData<Microblock>(queryKey, queryClient);
}

export const getMicroblockPageQueryProps = async (
  ctx: NextPageContext,
  queryClient: QueryClient
): Promise<Microblock> => {
  const microblockHash = getMicroblockHashFromCtx(ctx);
  const cachedMicroblock = getMicroblockPageCachedQueryProps(ctx, queryClient);
  if (cachedMicroblock) return cachedMicroblock;
  const { microblocksApi } = await getApiClients(ctx);
  return microblocksApi.getMicroblockByHash({
    hash: microblockHash,
  });
};

export const getMicroblockPageQueries: GetQueries<Microblock> = async (
  ctx,
  queryProps,
  queryClient
) => {
  const microblockHash = getMicroblockHashFromCtx(ctx);
  const { blocksApi } = await getApiClients(ctx);
  const { transactionsApi } = await getApiClients(ctx);
  const blocksQueryKey = queryProps?.block_hash && getBlocksQueryKey.single(queryProps?.block_hash);
  const txQueries: Queries<Microblock> =
    queryProps?.txs.map(txid => {
      const queryKey = getTxQueryKey.single(txid);
      return [
        queryKey,
        () => {
          const cached = queryClient && getSingleCachedQueryData(queryKey, queryClient);
          if (cached) return cached;
          return transactionsApi.getTransactionById({ txId: txid });
        },
      ];
    }) || [];

  return [
    [getMicroblocksQueryKey.single(microblockHash), () => queryProps],
    [
      blocksQueryKey,
      () => queryProps?.block_hash && blocksApi.getBlockByHash({ hash: queryProps?.block_hash }),
    ],
    ...txQueries,
  ];
};
