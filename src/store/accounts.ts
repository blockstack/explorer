import { apiClientsState } from '@store/api-clients';
import { atomFamilyWithQuery } from 'jotai-query-toolkit';

import type {
  AccountDataResponse,
  AddressStxInboundListResponse,
  AddressAssetsListResponse,
  AddressNftListResponse,
  AddressTransactionsWithTransfersListResponse,
  AddressStxBalanceResponse,
  AddressBalanceResponse,
} from '@stacks/stacks-blockchain-api-types';
import type { Getter } from 'jotai';
import type { TransactionsListResponse } from '@store/transactions';
import { atomFamilyWithInfiniteQuery, makeQueryKey } from 'jotai-query-toolkit';
import { QueryFunctionContext, QueryKey } from 'react-query';
import { getNextPageParam } from '@store/common';

// ----------------
// keys
// ----------------
export enum AccountsQueryKeys {
  INFO = 'accounts/INFO',
  BALANCES = 'accounts/BALANCES',
  STX_BALANCE = 'accounts/STX_BALANCE',
  TRANSACTIONS = 'accounts/TRANSACTIONS',
  TRANSACTIONS_WITH_TRANSFERS = 'accounts/TRANSACTIONS_WITH_TRANSFERS',
  ASSETS = 'accounts/ASSETS',
  NFT_EVENTS = 'accounts/NFT_EVENTS',
  INBOUND_STX_TRANSFERS = 'accounts/INBOUND_STX_TRANSFERS',
}

type Principal = string;
type PrincipalWithLimit = [principal: Principal, limit: number];
export const getAccountQueryKey = {
  info: (principal: Principal): QueryKey => makeQueryKey(AccountsQueryKeys.INFO, [principal]),
  balances: (principal: Principal): QueryKey =>
    makeQueryKey(AccountsQueryKeys.BALANCES, [principal]),
  stxBalance: (principal: Principal): QueryKey =>
    makeQueryKey(AccountsQueryKeys.STX_BALANCE, principal),
  transactions: (param: PrincipalWithLimit): QueryKey =>
    makeQueryKey(AccountsQueryKeys.TRANSACTIONS, param),
  transactionsWithTransfers: (param: PrincipalWithLimit): QueryKey =>
    makeQueryKey(AccountsQueryKeys.TRANSACTIONS_WITH_TRANSFERS, param),
  assets: (param: PrincipalWithLimit): QueryKey => makeQueryKey(AccountsQueryKeys.ASSETS, param),
  nftEvents: (param: PrincipalWithLimit): QueryKey =>
    makeQueryKey(AccountsQueryKeys.NFT_EVENTS, param),
  inbound: (param: PrincipalWithLimit): QueryKey =>
    makeQueryKey(AccountsQueryKeys.INBOUND_STX_TRANSFERS, param),
};

// ----------------
// queryFn's
// ----------------

// @see https://blockstack.github.io/stacks-blockchain-api/#operation/get_account_info
const accountInfoQueryFn = async (get: Getter, principal: Principal) => {
  const { accountsApi } = get(apiClientsState);
  return accountsApi.getAccountInfo({
    principal,
    proof: 0, // no need to fetch the proof
  });
};

// @see https://blockstack.github.io/stacks-blockchain-api/#operation/get_account_balance
const accountBalancesQueryFn = async (get: Getter, principal: Principal) => {
  const { accountsApi } = get(apiClientsState);
  return (await accountsApi.getAccountBalance({
    principal,
  })) as AddressBalanceResponse;
};

// @see https://blockstack.github.io/stacks-blockchain-api/#operation/get_account_stx_balance
const accountStxBalancesQueryFn = async (get: Getter, principal: Principal) => {
  const { accountsApi } = get(apiClientsState);
  return (await accountsApi.getAccountStxBalance({
    principal,
  })) as AddressStxBalanceResponse;
};

// @see https://blockstack.github.io/stacks-blockchain-api/#operation/get_account_transactions
const accountTransactionsQueryFn = async (
  get: Getter,
  [principal, limit]: PrincipalWithLimit,
  context: QueryFunctionContext
) => {
  const { accountsApi } = get(apiClientsState);
  const { pageParam } = context;
  return (await accountsApi.getAccountTransactions({
    principal,
    offset: pageParam || 0,
    limit,
  })) as TransactionsListResponse;
};

// @see https://blockstack.github.io/stacks-blockchain-api/#operation/get_account_transactions_with_transfers
const accountTransactionsWithTransfersQueryFn = async (
  get: Getter,
  [principal, limit]: PrincipalWithLimit,
  context: QueryFunctionContext
) => {
  const { accountsApi } = get(apiClientsState);
  const { pageParam } = context;
  return (await accountsApi.getAccountTransactionsWithTransfers({
    principal,
    offset: pageParam || 0,
    limit,
  })) as AddressTransactionsWithTransfersListResponse;
};

// @see https://blockstack.github.io/stacks-blockchain-api/#operation/get_account_assets
const accountAssetsQueryFn = async (
  get: Getter,
  [principal, limit]: PrincipalWithLimit,
  context: QueryFunctionContext
) => {
  const { accountsApi } = get(apiClientsState);
  const { pageParam } = context;
  return (await accountsApi.getAccountAssets({
    principal,
    offset: pageParam || 0,
    limit,
  })) as AddressAssetsListResponse;
};

// @see https://blockstack.github.io/stacks-blockchain-api/#operation/get_account_nft
const accountNftEventsQueryFn = async (
  get: Getter,
  [principal, limit]: PrincipalWithLimit,
  context: QueryFunctionContext
) => {
  const { accountsApi } = get(apiClientsState);
  const { pageParam } = context;
  return await accountsApi.getAccountNft({
    principal,
    offset: pageParam || 0,
    limit,
  });
};

// @see https://blockstack.github.io/stacks-blockchain-api/#operation/get_account_inbound
const accountInboundQueryFn = async (
  get: Getter,
  [principal, limit]: PrincipalWithLimit,
  context: QueryFunctionContext
) => {
  const { accountsApi } = get(apiClientsState);
  const { pageParam } = context;
  return await accountsApi.getAccountInbound({
    principal,
    offset: pageParam || 0,
    limit,
  });
};

// ----------------
// atoms
// ----------------
export const accountInfoState = atomFamilyWithQuery<string, AccountDataResponse>(
  AccountsQueryKeys.INFO,
  accountInfoQueryFn
);
export const accountBalancesResponseState = atomFamilyWithQuery<string, AddressBalanceResponse>(
  AccountsQueryKeys.BALANCES,
  accountBalancesQueryFn
);
export const accountStxBalanceResponseState = atomFamilyWithQuery<
  string,
  AddressStxBalanceResponse
>(AccountsQueryKeys.STX_BALANCE, accountStxBalancesQueryFn);

export const accountTransactionsState = atomFamilyWithInfiniteQuery<
  PrincipalWithLimit,
  TransactionsListResponse
>(AccountsQueryKeys.TRANSACTIONS, accountTransactionsQueryFn, {
  getNextPageParam,
});

export const accountTransactionsWithTransfersState = atomFamilyWithInfiniteQuery<
  PrincipalWithLimit,
  AddressTransactionsWithTransfersListResponse
>(AccountsQueryKeys.TRANSACTIONS_WITH_TRANSFERS, accountTransactionsWithTransfersQueryFn, {
  getNextPageParam,
});
export const accountAssetsResponseState = atomFamilyWithInfiniteQuery<
  PrincipalWithLimit,
  AddressAssetsListResponse
>(AccountsQueryKeys.ASSETS, accountAssetsQueryFn, { getNextPageParam });

export const accountNftEventsResponseState = atomFamilyWithInfiniteQuery<
  PrincipalWithLimit,
  AddressNftListResponse
>(AccountsQueryKeys.NFT_EVENTS, accountNftEventsQueryFn, { getNextPageParam });

export const accountInboundStxTransfersResponseState = atomFamilyWithInfiniteQuery<
  PrincipalWithLimit,
  AddressStxInboundListResponse
>(AccountsQueryKeys.NFT_EVENTS, accountInboundQueryFn, { getNextPageParam });
