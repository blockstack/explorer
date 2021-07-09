import { atom, Getter } from 'jotai';
import { apiClientsState } from '@store/api-clients';
import { ContractInterfaceResponse, ContractSourceResponse } from '@stacks/blockchain-api-client';
import { QueryRefreshRates } from '@common/constants';
import { QueryKey } from 'react-query';
import { makeQueryKey, atomFamilyWithQuery } from 'jotai-query-toolkit';
import { atomFamily } from 'jotai/utils';
import { transactionSingleState } from '@store/transactions';
import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

// ----------------
// keys
// ----------------
export enum ContractsQueryKeys {
  INFO = 'contracts/INFO',
  SOURCE = 'contracts/SOURCE',
  INTERFACE = 'contracts/INTERFACE',
}

export const getContractQueryKeys = {
  info: (contractId: string): QueryKey => makeQueryKey(ContractsQueryKeys.INFO, contractId),
  source: (contractId: string): QueryKey => makeQueryKey(ContractsQueryKeys.SOURCE, contractId),
  interface: (contractId: string): QueryKey =>
    makeQueryKey(ContractsQueryKeys.INTERFACE, contractId),
};

// ----------------
// queryFn's
// ----------------

const contractInfoQueryFn = async (get: Getter, contractId: string) => {
  const { smartContractsApi } = get(apiClientsState);
  return smartContractsApi.getContractById({
    contractId: contractId,
  });
};

// ----------------
// atoms
// ----------------
export const contractInfoState = atomFamilyWithQuery<string, any>(
  ContractsQueryKeys.INFO,
  contractInfoQueryFn,
  { refetchInterval: QueryRefreshRates.None, getShouldRefetch: () => false }
);

export const contractSourceState = atomFamily<string, string>(contractId =>
  atom(get => {
    const info = get(contractInfoState(contractId));
    return info.source_code;
  })
);

export const contractInterfaceState = atomFamily<string, ContractInterfaceResponse>(contractId =>
  atom(get => {
    const info = get(contractInfoState(contractId));
    return info.abi;
  })
);

export const transactionFromContractId = atomFamily<
  string,
  Transaction | MempoolTransaction | undefined
>(contract_id =>
  atom(get => {
    const contractInfo = get(contractInfoState(contract_id));
    return get(transactionSingleState(contractInfo.tx_id));
  })
);
