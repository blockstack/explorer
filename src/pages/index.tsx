import React from 'react';
import { Grid } from '@stacks/ui';
import { Meta } from '@components/meta-head';
import { HomePageTop } from '@components/home-page-top';
import { TabbedTransactionList } from '@components/tabbed-transaction-list';
import { BlocksList } from '@features/blocks-list';

import { DEFAULT_LIST_LIMIT_SMALL } from '@common/constants';
import { withInitialQueries } from '@common/with-initial-queries';
import { getHomePageQueries } from '@common/page-queries/home';

import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <>
      <Meta />
      <HomePageTop />
      <Grid
        mt="extra-loose"
        gap="extra-loose"
        gridTemplateColumns={['100%', '100%', 'calc(60% - 32px) 40%']}
        width="100%"
      >
        <TabbedTransactionList limit={DEFAULT_LIST_LIMIT_SMALL} />
        <BlocksList limit={DEFAULT_LIST_LIMIT_SMALL} />
      </Grid>
    </>
  );
};

Home.getInitialProps = () => {
  return { isHome: true };
};

export default withInitialQueries(Home)(getHomePageQueries);
