import {
  CoinbaseTransaction,
  ContractCallTransaction,
  ContractInterfaceResponse,
  MempoolCoinbaseTransaction,
  MempoolContractCallTransaction,
  MempoolPoisonMicroblockTransaction,
  MempoolSmartContractTransaction,
  MempoolTokenTransferTransaction,
  PoisonMicroblockTransaction,
  SmartContractTransaction,
  TokenTransferTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';

export type TokenTransferTxs = TokenTransferTransaction | MempoolTokenTransferTransaction;
export type CoinbaseTxs = CoinbaseTransaction | MempoolCoinbaseTransaction;
export type PoisonMicroblockTxs = PoisonMicroblockTransaction | MempoolPoisonMicroblockTransaction;
export type ContractCallTxs = ContractCallTransaction | MempoolContractCallTransaction;
export type ContractDeployTxs = SmartContractTransaction | MempoolSmartContractTransaction;
export type NonContractTxs = TokenTransferTxs | CoinbaseTxs | PoisonMicroblockTxs;

interface Tx<T> {
  transaction: T;
}

export interface ContractResponse {
  tx_id: string;
  contract_id: string;
  block_height: number;
  source_code: string;
  abi: string;
  canonical: true;
}

export interface Contract {
  tx_id: string;
  contract_id: string;
  block_height: number;
  source_code: string;
  abi: ContractInterfaceResponse;
  canonical: true;
}

interface TxDataWithContract<T = Transaction> extends Tx<T> {
  contract?: Contract;
}

interface TxDataContractCall {
  transaction: ContractCallTxs;
  source: TxDataWithContract<ContractDeployTxs>;
}

type TxDataContractDeploy = TxDataWithContract<ContractDeployTxs>;

export type TxData<T> = T extends NonContractTxs
  ? Tx<T>
  : T extends MempoolSmartContractTransaction
  ? Tx<MempoolSmartContractTransaction>
  : T extends ContractCallTxs
  ? TxDataContractCall
  : TxDataContractDeploy;
