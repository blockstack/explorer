import React from 'react';
import { Box, Flex, FlexProps, color } from '@stacks/ui';
import { css, Theme } from '@stacks/ui-core';
import dayjs from 'dayjs';

import { Footer } from '@components/footer';
import { Header } from '@components/header';
import { Notice } from '@components/notice';
import { MetaverseBg } from '@components/metaverse-bg';

import { TitleProps, TransactionTitle } from '@components/transaction-title';
import { Alert } from '@components/alert';

import {
  SITE_NOTICE_BANNER_LABEL,
  SITE_NOTICE_BANNER_MESSAGE,
  SITE_NOTICE_ENABLED,
} from '@common/constants';
import { useNetworkMode } from '@common/hooks/use-network-mode';
import type { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

type PageProps = {
  notice?: { label?: string; message?: string };
  fullWidth?: boolean;
  tx?: MempoolTransaction | Transaction;
} & FlexProps;

type PageWrapperProps = {
  isHome?: boolean;
  fullWidth?: boolean;
  notice?: any;
  networkMode?: string;
} & FlexProps;

export const PageTop: React.FC<TitleProps> = ({ tx, ...props }) => {
  // for testnet, show after 4 hours. for mainnet, show after 24 hours
  const HOURS_NOTICE_TESTNET = 4;
  const HOURS_NOTICE_MAINNET = 24;
  const status = tx.tx_status;
  const failed = status === 'abort_by_response' || status === 'abort_by_post_condition';
  const networkMode = useNetworkMode();
  const longPending =
    dayjs().diff(dayjs.unix((tx as any).receipt_time), 'h') >
    (networkMode === 'testnet' ? HOURS_NOTICE_TESTNET : HOURS_NOTICE_MAINNET);

  const failedMessage =
    status === 'abort_by_response'
      ? 'This transaction did not succeed because the transaction was aborted during its execution.'
      : 'This transaction would have succeeded, but was rolled back by a supplied post-condition.';

  const longPendingMessage =
    'Transactions that cannot be confirmed within 256 blocks are eventually canceled automatically.';

  return (
    <Box width="100%" {...props}>
      <TransactionTitle mb="loose" tx={tx} />
      {failed ? (
        <Alert
          mb="base"
          error={{
            name: 'Notice',
            message: failedMessage,
          }}
        />
      ) : null}
      {longPending ? (
        <Alert
          mb="base"
          error={{
            name: 'Notice',
            message: longPendingMessage,
          }}
        />
      ) : null}
    </Box>
  );
};

export const Page: React.FC<PageProps> = React.memo(({ children, fullWidth, ...rest }) => (
  <Flex
    css={(theme: Theme) =>
      css({
        '*::selection': {
          color: 'white',
          background: color('accent'),
          transition: 'all 0.12s ease-in-out',
        },
      })(theme)
    }
    flexDirection="column"
    width="100%"
    minHeight="100%"
    position="relative"
    zIndex={2}
    flexGrow={1}
  >
    {SITE_NOTICE_ENABLED && (
      <Box px="base-loose">
        <Notice label={SITE_NOTICE_BANNER_LABEL} message={SITE_NOTICE_BANNER_MESSAGE} />
      </Box>
    )}
    <Flex
      as="main"
      mx="auto"
      width="100%"
      flexGrow={1}
      height="100%"
      maxWidth={fullWidth ? '100%' : '1280px'}
      flexDirection="column"
      px={['base', 'base', 'extra-loose']}
      {...rest}
    >
      {children}
    </Flex>
    <Footer
      mx="auto"
      width="100%"
      maxWidth={fullWidth ? '100%' : '1280px'}
      mt={fullWidth ? 'unset' : 'extra-loose'}
      mb={['base', 'base', 'extra-loose']}
      px={fullWidth ? 'unset' : ['base', 'base', 'extra-loose']}
      fullWidth={fullWidth}
    />
  </Flex>
));

export const PageWrapper: React.FC<PageWrapperProps> = ({
  networkMode,
  fullWidth,
  isHome,
  ...props
}) => (
  <Flex
    maxWidth="100vw"
    overflowX="hidden"
    bg={color('bg')}
    flexDirection="column"
    minHeight="100vh"
    position="relative"
    overflow="hidden"
  >
    <Header fullWidth={fullWidth} isHome={isHome} />
    <Page fullWidth={fullWidth} {...props} />
    <MetaverseBg />
  </Flex>
);
