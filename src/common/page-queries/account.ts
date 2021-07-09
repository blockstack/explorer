import { NextPageContext } from 'next';
import { GetQueries } from 'jotai-query-toolkit/ts3.4/nextjs';
import { getAccountQueryKey } from '@store/accounts';
import { getApiClients } from '@common/api/client';
import { DEFAULT_LIST_LIMIT } from '@common/constants';

export function getPrincipalFromCtx(ctx: NextPageContext) {
  const { query } = ctx;
  const principal: string = query?.principal as string;
  return principal;
}

export const getAccountPageQueries: GetQueries = async ctx => {
  const principal = getPrincipalFromCtx(ctx);
  const { accountsApi } = await getApiClients(ctx);
  return [
    [
      getAccountQueryKey.balances(principal),
      async () => accountsApi.getAccountBalance({ principal }),
    ],
    [getAccountQueryKey.info(principal), async () => accountsApi.getAccountInfo({ principal })],
    [
      getAccountQueryKey.transactions([principal, DEFAULT_LIST_LIMIT]),
      async () => accountsApi.getAccountTransactions({ principal, limit: DEFAULT_LIST_LIMIT }),
    ],
  ];
};
