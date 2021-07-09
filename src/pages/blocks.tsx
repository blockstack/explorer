import * as React from 'react';
import { Box } from '@stacks/ui';
import { Title } from '@components/typography';
import { Meta } from '@components/meta-head';
import { BlocksList } from '@features/blocks-list';
import { withInitialQueries } from '@common/with-initial-queries';
import type { NextPage } from 'next';
import { getBlocksPageQueries } from '@common/page-queries/blocks';

const BlocksPage: NextPage = () => (
  <>
    <Meta title="Recent Blocks" />
    <Box mb="base-loose">
      <Title mt="72px" color="white" as="h1" fontSize="36px">
        Blocks
      </Title>
      <BlocksList limit={30} />
    </Box>
  </>
);

export default withInitialQueries(BlocksPage)(getBlocksPageQueries);
