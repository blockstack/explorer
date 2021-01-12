import type {
  AddressBalanceResponse,
  MempoolTransaction,
  TransactionResults,
} from '@blockstack/stacks-blockchain-api-types';

import { fetchPendingTxs } from '@common/api/transactions';
import { fetchFromSidecar } from '@common/api/fetch';

export const fetchBalances = (apiServer: string) => async (
  principal: string
): Promise<AddressBalanceResponse> => {
  const path = `/address/${principal}/balances`;
  const res = await fetchFromSidecar(apiServer)(path);
  return res.json();
};

export const fetchTransactions = (apiServer: string) => async (
  principal: string,
  limit?: number
): Promise<TransactionResults> => {
  const path = `/address/${principal}/transactions?limit=${limit || 50}`;
  const res = await fetchFromSidecar(apiServer)(path);
  const final = await res.json();

  return final;
};

export interface AllAccountData {
  balances: AddressBalanceResponse;
  transactions: TransactionResults | null;
  pendingTransactions: MempoolTransaction[];
}

interface AllAccountOptionsBase {
  principal: string;
  txLimit?: number;
  doNotFetchTransactions?: boolean;
}

export const fetchAllAccountData = (apiServer: string) => async (
  options: AllAccountOptionsBase
): Promise<AllAccountData> => {
  const [balances, transactions, pendingTransactions] = await Promise.all([
    fetchBalances(apiServer)(options.principal),
    options.doNotFetchTransactions
      ? new Promise<null>(resolve => {
          return resolve(null);
        })
      : fetchTransactions(apiServer)(options.principal, options.txLimit || 50),
    fetchPendingTxs(apiServer)({ query: options.principal, type: 'principal' }),
  ]);

  return {
    balances,
    transactions,
    pendingTransactions: pendingTransactions as MempoolTransaction[],
  };
};
