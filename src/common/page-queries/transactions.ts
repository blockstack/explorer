import { GetQueries } from 'jotai-query-toolkit/nextjs';
import { getApiClients } from '@common/api/client';
import { getTxQueryKey, TransactionsListResponse } from '@store/transactions';
import { DEFAULT_LIST_LIMIT } from '@common/constants';

export const getTransactionsPageQueries: GetQueries = async ctx => {
  const { transactionsApi } = await getApiClients(ctx);
  return [
    [
      getTxQueryKey.confirmed(DEFAULT_LIST_LIMIT),
      async () => {
        return (await transactionsApi.getTransactionList({
          limit: DEFAULT_LIST_LIMIT,
          offset: 0,
        })) as TransactionsListResponse;
      },
    ],
    [
      getTxQueryKey.mempool(DEFAULT_LIST_LIMIT),
      async () => {
        return (await transactionsApi.getMempoolTransactionList({
          limit: DEFAULT_LIST_LIMIT,
          offset: 0,
        })) as TransactionsListResponse;
      },
    ],
  ];
};
