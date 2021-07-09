import * as React from 'react';
import { Block, CoinbaseTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { Box, Flex } from '@stacks/ui';
import { Title } from '@components/typography';
import { validateTxId } from '@common/utils';
import { Rows } from '@components/rows';
import { NextPage } from 'next';

import { Section } from '@components/section';
import { Timestamp } from '@components/timestamp';

import { Meta } from '@components/meta-head';
import { PagePanes } from '@components/page-panes';
import { BlockNotFound } from '@components/block-not-found';
import { BtcAnchorBlockCard } from '@components/btc-anchor-card';
import { TransactionList, TxList } from '@components/transaction-list';
import { withInitialQueries } from '@common/with-initial-queries';
import {
  getBlockHashFromCtx,
  getBlockPageQueries,
  getBlockPageQueryProps,
} from '@common/page-queries/block-hash';
import {
  useBlockCurrentlyInView,
  useBlockTxsCurrentlyInView,
} from '../../hooks/currently-in-view-hooks';

interface BlockSinglePageData {
  hash: string;
  error?: boolean;
}

const BlockSinglePage: NextPage<BlockSinglePageData> = ({ error, hash }) => {
  const block = useBlockCurrentlyInView();
  const transactions = useBlockTxsCurrentlyInView();
  if (error || !block || !transactions) {
    return (
      <>
        <Meta title="Block hash not found" />
        <BlockNotFound isPending={validateTxId(hash)} />;
      </>
    );
  }
  const title = `Block #${block.height.toLocaleString()}`;

  const coinbaseTx = (transactions as Transaction[])?.find(
    tx => tx.tx_type === 'coinbase'
  ) as CoinbaseTransaction;

  const transactionsWithoutCoinbase = (transactions as Transaction[])?.filter(
    tx => tx.tx_type !== 'coinbase'
  );
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
      <PagePanes>
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
                  children: `#${block.height}`,
                },
                {
                  label: {
                    children: 'Mined',
                  },
                  children: <Timestamp ts={block.burn_block_time} />,
                },
                {
                  label: {
                    children: 'Transactions',
                  },
                  children: block.txs.length,
                },
              ]}
            />
          </Box>
        </Section>
        <BtcAnchorBlockCard block={block} />
      </PagePanes>
      <Section overflow="hidden" px="base-loose" mt="extra-loose">
        <TxList items={[coinbaseTx]} />
      </Section>
      {transactionsWithoutCoinbase?.length ? (
        <TransactionList mt="extra-loose" transactions={transactionsWithoutCoinbase} />
      ) : null}
    </>
  );
};

BlockSinglePage.getInitialProps = ctx => {
  const hash = getBlockHashFromCtx(ctx);
  return {
    hash,
    inView: { type: 'block', payload: hash },
    error: false,
  };
};
export default withInitialQueries<Block, BlockSinglePageData>(BlockSinglePage)(
  getBlockPageQueries,
  getBlockPageQueryProps
);
