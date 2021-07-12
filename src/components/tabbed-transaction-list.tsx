import * as React from 'react';
import { Flex } from '@stacks/ui';
import { Section } from '@components/section';
import { FilterButton } from '@components/filter-button';
import {
  useMempoolTransactionsListState,
  useTransactionsListState,
} from '../hooks/use-transactions-list-state';
import { useTabs } from '../hooks/use-tabs';
import { InfiniteTransactionsList } from '@components/infinite-item-list';
import { Tabs } from '@components/tabs';
import { Subheader } from './transaction-list-subheader';

const TX_TABS = 'tabs/tx-list';

export enum ListTypes {
  MICROBLOCK = 'microblock',
  ANCHOR_BLOCK = 'anchor-block',
  PENDING = 'pending',
}

export const TabbedTransactionList: React.FC<{
  limit?: number;
  infinite?: boolean;
}> = ({ limit, infinite }) => {
  const [confirmedPages, confirmedActions] = useTransactionsListState(limit);
  const [mempoolPages, mempoolActions] = useMempoolTransactionsListState(limit);

  // if there are no mempool transactions, default to confirmed
  const defaultIndex = mempoolPages?.pages[0]?.results.length === 0 ? 1 : 0;
  const { currentIndex } = useTabs(TX_TABS);
  const mempoolSelected = currentIndex !== 0;

  const data = mempoolSelected ? mempoolPages : confirmedPages;
  const { isFetchingNextPage, hasNextPage, fetchNextPage } = mempoolSelected
    ? mempoolActions
    : confirmedActions;

  if (!data) return null;
  console.log(data);
  return (
    <Section
      title={() => (
        <Tabs tabs={['confirmed', 'pending']} stateKey={TX_TABS} defaultIndex={defaultIndex} />
      )}
      headerProps={{
        pl: '0',
      }}
      alignSelf="flex-start"
      topRight={!mempoolSelected && infinite && FilterButton}
    >
      <Flex flexGrow={1} flexDirection="column" px="base-loose">
        {/* TODO: Not sure if this is the best way to handle these two lists? */}
        {!mempoolSelected && (
          <>
            <Subheader subtitle="In microblock" />
            <InfiniteTransactionsList
              data={data}
              showLoadMoreButton={infinite}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              listType={ListTypes.MICROBLOCK}
            />
          </>
        )}
        {!mempoolSelected && <Subheader subtitle="In anchor block" />}
        <InfiniteTransactionsList
          data={data}
          showLoadMoreButton={infinite}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          listType={!mempoolSelected ? ListTypes.ANCHOR_BLOCK : ListTypes.PENDING}
        />
      </Flex>
    </Section>
  );
};
