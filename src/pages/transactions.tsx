import React from 'react';
import { Box } from '@stacks/ui';

import { Title } from '@components/typography';
import { Meta } from '@components/meta-head';
import { TabbedTransactionList } from '@components/tabbed-transaction-list';

import { withInitialQueries } from '@common/with-initial-queries';
import { DEFAULT_LIST_LIMIT } from '@common/constants';
import { getTransactionsPageQueries } from '@common/page-queries/transactions';

import type { NextPage } from 'next';

const TransactionsPage: NextPage = () => {
  return (
    <>
      <Meta title="Recent transactions" />
      <Box mb="base-loose">
        <Title mt="72px" color="white" as="h1" fontSize="36px">
          Transactions
        </Title>
        <TabbedTransactionList infinite limit={DEFAULT_LIST_LIMIT} />
      </Box>
    </>
  );
};

export default withInitialQueries(TransactionsPage)(getTransactionsPageQueries);
