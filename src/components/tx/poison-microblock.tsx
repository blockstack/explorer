import * as React from 'react';
import { Stack } from '@stacks/ui';
import { PageTop } from '@components/page';
import { Rows } from '@components/rows';
import { TransactionDetails } from '@components/transaction-details';
import { PoisonMicroblockTxs, TxData } from '@common/types/tx';
import { Block } from '@stacks/stacks-blockchain-api-types';

// TODO: make this real
const PoisonMicroblockPage = ({ transaction }: TxData<PoisonMicroblockTxs> & { block?: Block }) => (
  <>
    <PageTop tx={transaction as any} />
    <Stack spacing="extra-loose">
      <TransactionDetails transaction={transaction} hideContract />
      <Rows
        items={[
          {
            label: {
              children: 'Header 1',
            },
            children: '8a664c1dd163643b40a4e300daffdc1ea6af493d5ee7338ada9396b63b32dedc',
          },
          {
            label: {
              children: 'Header 2',
            },
            children: '8a664c1dd163643b40a4e300daffdc1ea6af493d5ee7338ada9396b63b32dedc',
          },
        ]}
      />
    </Stack>
  </>
);

export default PoisonMicroblockPage;
