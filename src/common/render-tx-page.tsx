import * as React from 'react';

import type { FetchTransactionResponse } from '@common/api/transactions';
import type {
  CoinbaseTxs,
  ContractCallTxs,
  ContractDeployTxs,
  PoisonMicroblockTxs,
  TokenTransferTxs,
  TxData,
} from '@common/types/tx';
import type { Block } from '@blockstack/stacks-blockchain-api-types';

import CoinbasePage from '../components/tx/coinbase';
import ContractCallPage from '../components/tx/contract-call';
import PoisonMicroblockPage from '../components/tx/poison-microblock';
import SmartContractPage from '../components/tx/smart-contract';
import TokenTransferPage from '../components/tx/token-transfer';
import { AllAccountData } from '@common/api/accounts';

export const renderTxPageComponent = ({
  data,
  block,
  account,
  btc,
}: {
  data: FetchTransactionResponse;
  block?: Block;
  account?: AllAccountData;
  btc: null | string;
}) => {
  if ('transaction' in data) {
    switch (data.transaction.tx_type) {
      case 'coinbase':
        return <CoinbasePage {...(data as TxData<CoinbaseTxs>)} block={block} />;
      case 'token_transfer':
        return <TokenTransferPage {...(data as TxData<TokenTransferTxs>)} block={block} />;
      case 'contract_call':
        return <ContractCallPage {...(data as TxData<ContractCallTxs>)} btc={btc} block={block} />;
      case 'smart_contract':
        return (
          <SmartContractPage
            {...(data as TxData<ContractDeployTxs>)}
            block={block}
            account={account}
          />
        );
      case 'poison_microblock':
        return <PoisonMicroblockPage {...(data as TxData<PoisonMicroblockTxs>)} block={block} />;
      default:
        throw new Error('Must pass valid transaction type');
    }
  }
  return null;
};
