import * as React from 'react';
import { Stack } from '@stacks/ui';
import { Events } from '@components/tx-events';
import { PageTop } from '@components/page';
import { TransactionDetails } from '@components/transaction-details';
import { BtcAnchorBlockCard } from '@components/btc-anchor-card';
import { PagePanes } from '@components/page-panes';
import { useBlockInView, useTransactionInView } from '../../hooks/currently-in-view-hooks';

const TokenTransferPage = () => {
  const transaction = useTransactionInView();
  const block = useBlockInView();
  if (!transaction) return null;
  return (
    <>
      <PageTop tx={transaction as any} />
      <PagePanes fullWidth={transaction.tx_status === 'pending' || block === null}>
        <Stack spacing="extra-loose">
          <TransactionDetails transaction={transaction} hideContract />
          {'events' in transaction && (
            <Events txId={transaction.tx_id} events={transaction.events} />
          )}
        </Stack>
        {block && <BtcAnchorBlockCard block={block} />}
      </PagePanes>
    </>
  );
};

export default TokenTransferPage;
