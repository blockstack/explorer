import { atomFamily } from 'jotai/utils';
import { atom } from 'jotai';
import { TransactionType } from '@common/constants';

export type TxTypeFilterOptions = [
  typeof TransactionType.SMART_CONTRACT,
  typeof TransactionType.CONTRACT_CALL,
  typeof TransactionType.TOKEN_TRANSFER,
  typeof TransactionType.COINBASE
];
export const DEFAULT_TX_FILTER_TYPES = [
  TransactionType.SMART_CONTRACT,
  TransactionType.CONTRACT_CALL,
  TransactionType.TOKEN_TRANSFER,
  TransactionType.COINBASE,
];
const defaultValue = {
  showing: false,
  types: DEFAULT_TX_FILTER_TYPES,
  showPending: true,
  showFailed: true,
};

export const filterState = atomFamily(_param => atom(defaultValue));
