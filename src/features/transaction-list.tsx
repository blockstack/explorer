import { useMemo } from 'react';
import { TransactionListItem } from '@components/transaction-list-item';
import * as React from 'react';
import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

type Item = MempoolTransaction | Transaction;

export interface Pages {
  limit: number;
  offset: number;
  total: number;
  results: Item[];
}

interface TransactionListProps {
  isLastPage?: boolean;
  data: Pages;
}

function getUniqueListBy<T>(arr: T[], key: keyof T): T[] {
  return [...new Map(arr.map(item => [item[key], item])).values()] as unknown as T[];
}

export const TransactionList = (props: TransactionListProps) => {
  const { data, isLastPage } = props;
  const { results } = data;
  const list = useMemo(() => getUniqueListBy<Item>(results, 'tx_id'), [results]);
  return (
    <>
      {list?.map((item: Item, itemIndex: number) => (
        <TransactionListItem
          tx={item}
          key={item.tx_id}
          isLast={isLastPage && itemIndex + 1 === list.length}
        />
      ))}
    </>
  );
};
