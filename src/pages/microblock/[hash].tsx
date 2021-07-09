import * as React from 'react';
import { Microblock } from '@stacks/stacks-blockchain-api-types';
import { Box, Flex } from '@stacks/ui';
import { Title } from '@components/typography';
import { truncateMiddle } from '@common/utils';
import { Rows } from '@components/rows';
import { NextPage, NextPageContext } from 'next';
import { Section } from '@components/section';
import { Meta } from '@components/meta-head';
import { PagePanes } from '@components/page-panes';
// import { BlockNotFound } from '@components/block-not-found';
import { TransactionList } from '@components/transaction-list';
import { withInitialQueries } from '@common/with-initial-queries';
import {
  useMicroblockBlockCurrentlyInView,
  useMicroblockCurrentlyInView,
  useMicroblockTxsCurrentlyInView,
} from 'hooks/currently-in-view-hooks';
import {
  getMicroblockHashFromCtx,
  getMicroblockPageQueries,
  getMicroblockPageQueryProps,
} from '@common/page-queries/microblock-hash';
import { Timestamp } from '@components/timestamp';

interface MicroblockSinglePageData {
  hash: string;
  error?: boolean;
}

const MicroblockSinglePage: NextPage<MicroblockSinglePageData> = ({ error, hash }) => {
  const microblock = useMicroblockCurrentlyInView();
  const block = useMicroblockBlockCurrentlyInView();
  const transactions = useMicroblockTxsCurrentlyInView();
  if (error || !microblock || !block || !transactions) {
    return (
      <>
        <Meta title="Microblock hash not found" />
        {/* MICROBLOCK TODO: Need to make this */}
        {/* <MicroblockNotFound isPending={validateTxId(hash)} />; */}
      </>
    );
  }
  const title = `Microblock ${truncateMiddle(microblock.microblock_hash)}`;

  const transactionsWithoutCoinbase = transactions?.filter(tx => tx.tx_type !== 'coinbase');

  return (
    <>
      <Meta title={title} />
      <Flex mb="base" alignItems="flex-end" justifyContent="space-between">
        <Box>
          <Title mb="base" mt="64px" as="h1" color="white" fontSize="36px">
            {title}
          </Title>
        </Box>
      </Flex>
      <PagePanes fullWidth>
        <Section title="Summary">
          <Box px="base">
            <Rows
              noTopBorder
              items={[
                {
                  label: {
                    children: 'Hash',
                  },
                  children: hash,
                  copy: hash,
                },
                {
                  label: {
                    children: 'Block height',
                  },
                  children: `#${microblock.block_height}`,
                },
                {
                  label: {
                    children: 'Accepted',
                  },
                  children: <Timestamp ts={block.burn_block_time} />,
                },
                {
                  label: {
                    children: 'Transactions',
                  },
                  children: microblock.txs.length,
                },
              ]}
            />
          </Box>
        </Section>
      </PagePanes>
      {transactionsWithoutCoinbase?.length ? (
        <TransactionList mt="extra-loose" transactions={transactionsWithoutCoinbase} />
      ) : null}
    </>
  );
};

MicroblockSinglePage.getInitialProps = ctx => {
  const hash = getMicroblockHashFromCtx(ctx);
  return {
    hash,
    inView: { type: 'microblock', payload: hash },
    error: false,
  };
};

export default withInitialQueries<Microblock, MicroblockSinglePageData>(MicroblockSinglePage)(
  getMicroblockPageQueries,
  getMicroblockPageQueryProps
);
