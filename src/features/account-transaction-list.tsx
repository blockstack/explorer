import { Box } from '@stacks/ui';
import { InfiniteTransactionsList } from '@components/infinite-item-list';
import { Section } from '@components/section';
import * as React from 'react';
import { useAccountInViewTransactions } from '../hooks/currently-in-view-hooks';

export function AccountTransactionList() {
  const [transactions, { hasNextPage, fetchNextPage, isFetchingNextPage }] =
    useAccountInViewTransactions();
  if (!transactions) return null;
  return (
    <Section title="Transactions">
      <Box px="loose">
        <InfiniteTransactionsList
          data={transactions}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          showLoadMoreButton
        />
      </Box>
    </Section>
  );
}
