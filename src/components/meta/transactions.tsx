import * as React from 'react';
import {
  getContractName,
  getFunctionName,
  getMemoString,
  microToStacks,
  toRelativeTime,
  truncateMiddle,
} from '@common/utils';
import { Meta } from '@components/meta-head';
import type { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { getContractId } from '@components/transaction-details';
import { getTxErrorMessage } from '@common/utils/errors';
import { useTransactionInView } from '../../hooks/currently-in-view-hooks';

const getTxPageTitle = (tx: Transaction | MempoolTransaction) => {
  switch (tx.tx_type) {
    case 'contract_call':
      return `Function call`;
    case 'smart_contract':
      return 'Contract deploy';
    case 'coinbase':
      return `Coinbase`;
    case 'poison_microblock':
      return 'Poison Microblock';
    case 'token_transfer':
      return 'STX transfer';
  }
};

const getOgTitle = (tx: Transaction | MempoolTransaction) => {
  switch (tx.tx_type) {
    case 'contract_call': {
      const functionName = getFunctionName(tx);
      const contract = getContractId(tx);
      const name = contract && getContractName(contract);
      return `${functionName} ← ${name}`;
    }
    case 'smart_contract': {
      const contract = getContractId(tx);
      const name = contract && getContractName(contract);
      return `${name}`;
    }
    case 'token_transfer': {
      return `${microToStacks(tx.token_transfer.amount)} STX transferred`;
    }
    case 'coinbase':
      return `Coinbase${
        tx.tx_status !== 'pending' && ` for block #${(tx as Transaction).block_height}`
      }`;
    case 'poison_microblock':
      return truncateMiddle(tx.tx_id);
  }
};

const getDescription = (tx: Transaction | MempoolTransaction) => {
  switch (tx.tx_type) {
    case 'token_transfer': {
      const amount = `${microToStacks(tx.token_transfer.amount)} STX`;
      return `This transaction transferred ${amount} from ${truncateMiddle(
        tx.sender_address
      )} to ${truncateMiddle(tx.token_transfer.recipient_address)}${
        tx.token_transfer.memo
          ? ` with the message "${getMemoString(tx.token_transfer.memo)}".`
          : '.'
      }`;
    }
    case 'smart_contract': {
      const contract = getContractId(tx);
      const contractName = contract && getContractName(contract);
      return `This transaction deployed a smart contract with the name '${contractName}' from the address ${truncateMiddle(
        tx.sender_address,
        8
      )}.${
        tx.tx_status !== 'success' && tx.tx_status !== 'pending' ? ` ${getTxErrorMessage(tx)}` : ''
      }${
        'events' in tx && tx.events.length
          ? ` The transaction generated a total of ${tx.events.length} events during its execution.`
          : ''
      }`;
    }
    case 'contract_call':
      const functionName = getFunctionName(tx);
      const contract = getContractId(tx);
      return `This transaction called the public function '${functionName}' from the contract ${
        contract && truncateMiddle(contract)
      }.${
        tx.tx_status !== 'success' && tx.tx_status !== 'pending' ? ` ${getTxErrorMessage(tx)}` : ''
      }${
        'events' in tx && tx.events.length
          ? ` This transaction generated a total of ${tx.events.length} events during its execution.`
          : ''
      }`;
  }
};

export const TransactionMeta = () => {
  const transaction = useTransactionInView();
  if (!transaction) return null;

  const pageTitle = `${getTxPageTitle(transaction)}${
    transaction.tx_status === 'pending' ? ' (Pending)' : ''
  }${
    transaction.tx_status !== 'success' && transaction.tx_status !== 'pending' ? ' (Failed) ' : ''
  }`;
  const ogTitle = getOgTitle(transaction);
  const ogUrl = `/txid/${transaction.tx_id}`;
  const ogDescription = getDescription(transaction);

  const labels =
    'burn_block_time' in transaction
      ? [
          {
            label: 'Confirmed',
            data: `${toRelativeTime(transaction?.burn_block_time * 1000)}, in block #${
              transaction.block_height
            }`,
          },
        ]
      : undefined;

  return (
    <Meta
      title={pageTitle}
      ogTitle={ogTitle}
      description={ogDescription}
      url={ogUrl}
      status={transaction.tx_status}
      key={transaction.tx_status}
      labels={labels}
    />
  );
};
