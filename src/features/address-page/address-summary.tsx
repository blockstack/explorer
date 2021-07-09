import * as React from 'react';
import { Section } from '@components/section';
import { Rows } from '@components/rows';
import { Activity } from '@components/activity-row';
import { TokenBalancesRow } from '@components/balances/token-balances-row';
import { microToStacks } from '@common/utils';

export const AddressSummary = ({
  principal,
  hasTokenBalances,
  balances,
  transactions,
  nonce,
}: any) => {
  return (
    <Section mb={'extra-loose'} title="Summary">
      <Rows
        px="base"
        noTopBorder
        items={[
          {
            label: {
              children: 'Address',
            },
            children: principal,
            copy: principal,
          },
          {
            condition: !!transactions?.results?.length,
            label: {
              children: 'Activity',
            },
            children: <Activity txs={transactions?.results} amount={transactions?.total} />,
          },
          {
            condition: !!hasTokenBalances,
            label: {
              children: 'Holdings',
            },
            children: <TokenBalancesRow balances={balances} />,
          },
          {
            label: {
              children: 'Fees',
            },
            children: `${microToStacks(balances?.stx?.total_fees_sent || 0)} STX`,
          },
          {
            label: {
              children: 'Nonce',
            },
            children: nonce,
          },
        ]}
      />
    </Section>
  );
};
