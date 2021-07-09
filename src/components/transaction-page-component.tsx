import * as React from 'react';
import CoinbasePage from './tx/coinbase';
import ContractCallPage from './tx/contract-call';
import SmartContractPage from './tx/smart-contract';
import TokenTransferPage from './tx/token-transfer';
import { useTransactionTypeInView } from '../hooks/currently-in-view-hooks';

export const TransactionPageComponent = () => {
  const type = useTransactionTypeInView();
  if (!type) return null;
  switch (type) {
    case 'coinbase':
      return <CoinbasePage />;
    case 'token_transfer':
      return <TokenTransferPage />;
    case 'contract_call':
      return <ContractCallPage />;
    case 'smart_contract':
      return <SmartContractPage />;
    case 'poison_microblock':
      return null;
    default:
      return null;
  }
};
