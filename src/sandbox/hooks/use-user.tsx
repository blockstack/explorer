import * as React from 'react';
import { useAuthState } from '@sandbox/hooks/use-auth';
import { UserData } from '@stacks/auth';
import type {
  AddressBalanceResponse,
  MempoolTransaction,
  TransactionResults,
} from '@stacks/stacks-blockchain-api-types';
import { useNetworkMode } from '@common/hooks/use-network-mode';
import { useAtomValue } from 'jotai/utils';
import { accountBalancesResponseState, accountTransactionsState } from '@store/accounts';

export const useUser = (options?: {
  suspense?: boolean;
}): {
  principal?: string;
  transactions?: TransactionResults['results'];
  balances?: AddressBalanceResponse;
  pendingTransactions?: MempoolTransaction[];
  refreshPendingTransactions?: () => void;
  hasTransactions?: boolean;
} & Partial<UserData> => {
  const { userData } = useAuthState();
  const networkMode = useNetworkMode();

  const principal = networkMode && userData?.profile?.stxAddress?.[networkMode];
  const username = userData?.username;
  const profile = userData?.profile;

  const balances = useAtomValue(accountBalancesResponseState(principal));
  const transactions = useAtomValue(accountTransactionsState(principal));
  const pendingTransactions: any = { results: [] };

  const hasTransactions = !!(
    (transactions && transactions?.pages?.[0].total > 0) ||
    pendingTransactions?.results.length
  );
  return {
    principal,
    username,
    profile,
    transactions: transactions?.pages?.[0].results,
    balances,
    pendingTransactions,
    refreshPendingTransactions: () => console.log('todo'),
    hasTransactions,
    ...userData,
  };
};
