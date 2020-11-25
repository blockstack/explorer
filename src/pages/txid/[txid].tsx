import * as React from 'react';

import { Box, Grid, Stack } from '@stacks/ui';
import { PageWrapper } from '@components/page';
import { Title } from '@components/typography';
import { Section } from '@components/section';
import { Button } from '@components/button';
import { TransactionMeta } from '@components/meta/transactions';
import { IconAlertOctagon, IconInfoCircle } from '@tabler/icons';
import { MessageWithIcon } from '@components/message-with-icon';
import Link from 'next/link';

import { queryWith0x } from '@common/utils';
import { renderTxPageComponent } from '@common/render-tx-page';
import { useTransactionPageData } from '@common/hooks/use-transaction-page-data';
import { getServerSideApiServer } from '@common/api/utils';
import { fetchTransaction, FetchTransactionResponse } from '@common/api/transactions';

import type { NextPage, NextPageContext } from 'next';
import { fetchBlock } from '@common/api/blocks';
import { Block } from '@blockstack/stacks-blockchain-api-types';

const TransactionPage: NextPage<{
  txid: string;
  initialData: FetchTransactionResponse;
  block?: Block;
}> = ({ txid, initialData, block }) => {
  const { transaction, data, error, isPending } = useTransactionPageData({ txid, initialData });

  const hasInitialError = 'error' in initialData && initialData.error;

  if (hasInitialError || error || !data || !transaction) {
    return (
      <PageWrapper>
        <Title mb={['base', 'base', '0']} mt="64px" as="h1" color="white" fontSize="36px">
          Transaction not found
        </Title>
        <Section mt="extra-loose">
          <Grid placeItems="center" p="extra-loose" minHeight="350px">
            <Box>
              {isPending ? (
                <MessageWithIcon
                  icon={IconInfoCircle}
                  title="Nothing here, yet..."
                  message="Looks like this transaction is not currently available. If a transaction with this ID is found, the page will automatically update."
                  action={
                    <Stack isInline spacing="base">
                      <Box>
                        <Link href="/" passHref>
                          <Button mt="loose" as="a" display="block">
                            Go home
                          </Button>
                        </Link>
                      </Box>

                      <Box>
                        <Link href="/transactions" passHref>
                          <Button variant="secondary" mt="loose" as="a" display="block">
                            All transactions
                          </Button>
                        </Link>
                      </Box>
                    </Stack>
                  }
                />
              ) : (
                <MessageWithIcon
                  icon={IconAlertOctagon}
                  title="This ID doesn't seem right."
                  message="This page isn't available, and it looks like the Transaction ID provided isn't correct."
                  action={
                    <Stack isInline spacing="base">
                      <Box>
                        <Link href="/" passHref>
                          <Button mt="loose" as="a" display="block">
                            Go home
                          </Button>
                        </Link>
                      </Box>

                      <Box>
                        <Link href="/transactions" passHref>
                          <Button variant="secondary" mt="loose" as="a" display="block">
                            All transactions
                          </Button>
                        </Link>
                      </Box>
                    </Stack>
                  }
                />
              )}
            </Box>
          </Grid>
        </Section>
      </PageWrapper>
    );
  } else {
    return (
      <PageWrapper>
        <TransactionMeta transaction={transaction} />
        {transaction && renderTxPageComponent(data, block)}
      </PageWrapper>
    );
  }
};

export async function getServerSideProps(
  ctx: NextPageContext
): Promise<{
  props: {
    txid: string;
    initialData: FetchTransactionResponse;
    block?: Block;
  };
}> {
  const apiServer = getServerSideApiServer(ctx);
  const { query } = ctx;
  const txid = query?.txid ? queryWith0x(query?.txid.toString()) : '';
  const initialData = await fetchTransaction(apiServer)(txid.toString());

  let block = null;
  if ('transaction' in initialData && 'block_hash' in initialData.transaction) {
    const hash = initialData.transaction.block_hash;
    block = await fetchBlock(apiServer)(hash);
  }

  return {
    props: {
      txid,
      initialData,
      block: block as Block,
    },
  };
}

export default TransactionPage;
