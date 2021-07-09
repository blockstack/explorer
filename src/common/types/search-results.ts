import { Block, Transaction } from '@stacks/stacks-blockchain-api-types';

export enum SearchResultType {
  TxId = 'tx_id',
  MempoolTxId = 'mempool_tx_id',
  BlockHash = 'block_hash',
  StandardAddress = 'standard_address',
  ContractAddress = 'contract_address',
  UnknownHash = 'unknown_hash',
  InvalidTerm = 'invalid_term',
}

export interface FoundResult {
  found: true;
  result:
    | AddressSearchResult
    | ContractSearchResult
    | TxSearchResult
    | MempoolTxSearchResult
    | BlockSearchResult;
}

export interface NotFoundResult {
  found: false;
  result: {
    entity_type:
      | SearchResultType.StandardAddress
      | SearchResultType.ContractAddress
      | SearchResultType.UnknownHash
      | SearchResultType.InvalidTerm;
  };
  error: string;
}

export type SearchResult = FoundResult | NotFoundResult;

export interface AddressSearchResult {
  entity_type: SearchResultType.StandardAddress;
  entity_id: string;
}

export interface ContractSearchResult {
  entity_type: SearchResultType.ContractAddress;
  entity_id: string;
  tx_data?: Partial<Transaction>;
}

export interface TxSearchResult {
  entity_type: SearchResultType.TxId;
  entity_id: string;
  tx_data: Partial<Transaction>;
}

export interface MempoolTxSearchResult {
  entity_type: SearchResultType.MempoolTxId;
  entity_id: string;
  tx_data: Partial<Transaction>;
}

export interface BlockSearchResult {
  entity_type: SearchResultType.BlockHash;
  entity_id: string;
  block_data: Partial<Block>;
}
