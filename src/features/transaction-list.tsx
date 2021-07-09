import { useMemo } from 'react';
import { TransactionListItem } from '@components/transaction-list-item';
import * as React from 'react';
import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { ListTypes } from '@components/tabbed-transaction-list';

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
  listType: string;
}

function getUniqueListBy<T>(arr: T[], key: keyof T): T[] {
  return [...new Map(arr.map(item => [item[key], item])).values()] as unknown as T[];
}

export const TransactionList = (props: TransactionListProps) => {
  const { data, isLastPage, listType } = props;
  const { results } = data;
  const list = useMemo(() => getUniqueListBy<Item>(results, 'tx_id'), [results]);
  let newList = [];

  if (listType === ListTypes.MICROBLOCK) {
    newList = list.filter((tx: any) => !!tx.microblock_hash);
  } else if (listType === ListTypes.ANCHOR_BLOCK) {
    newList = list.filter((tx: any) => !tx.microblock_hash);
  } else {
    newList = list;
  }

  return (
    <>
      {newList?.map((item: Item, itemIndex: number) => (
        <TransactionListItem
          tx={item}
          key={item.tx_id}
          isLast={isLastPage && itemIndex + 1 === newList.length}
        />
      ))}
    </>
  );
};
