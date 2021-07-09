import * as React from 'react';
import type { NextPage } from 'next';
import { truncateMiddle } from '@common/utils';
import { Meta } from '@components/meta-head';
import { microStxToStx } from '@stacks/ui-utils';
import { Flex, Grid, Stack, GridProps } from '@stacks/ui';
import { getAccountPageQueries, getPrincipalFromCtx } from '@common/page-queries/account';
import { withInitialQueries } from '@common/with-initial-queries';
import {
  useAccountInViewBalances,
  useAccountInViewInfo,
} from '../../hooks/currently-in-view-hooks';
import { StxBalances } from '@components/balances/stx-balance-card';
import { TokenBalancesCard } from '@components/balances/principal-token-balances';
import { hasTokenBalance } from '@common/utils/accounts';
import { Title } from '@components/typography';
import { AddressSummary } from '@features/address-page/address-summary';
import { useRefreshOnBack } from '../../hooks/use-refresh-on-back';
import { AccountTransactionList } from '@features/account-transaction-list';

const PageTop = () => {
  return (
    <Flex
      mb="extra-loose"
      alignItems={['unset', 'unset', 'flex-end']}
      justifyContent="space-between"
      flexDirection={['column', 'column', 'row']}
    >
      <Title mb={['base', 'base', '0']} mt="64px" as="h1" color="white" fontSize="36px">
        Address details
      </Title>
    </Flex>
  );
};
const ContentWrapper = (props: GridProps) => {
  return (
    <Grid
      gridColumnGap="extra-loose"
      gridTemplateColumns={['100%', '100%', 'repeat(1, calc(100% - 352px) 320px)']}
      gridRowGap={['extra-loose', 'extra-loose', 'unset']}
      maxWidth="100%"
      alignItems="flex-start"
      {...props}
    />
  );
};

const AddressPage: NextPage<any> = ({ principal }) => {
  const balances = useAccountInViewBalances();
  const info = useAccountInViewInfo();
  const hasTokenBalances = hasTokenBalance(balances);

  useRefreshOnBack('principal');

  return (
    <>
      <Meta
        title={`STX Address ${truncateMiddle(principal)}`}
        labels={[
          {
            label: 'STX Balance',
            data: `${balances?.stx?.balance ? microStxToStx(balances.stx.balance) : 0} STX`,
          },
        ]}
      />
      <PageTop />
      <ContentWrapper>
        <Stack spacing="extra-loose">
          <AddressSummary
            principal={principal}
            hasTokenBalances={hasTokenBalances}
            balances={balances}
            nonce={info?.nonce}
          />
          <AccountTransactionList />
        </Stack>
        {balances && (
          <Stack spacing="extra-loose">
            <StxBalances principal={principal} balances={balances} />
            <TokenBalancesCard balances={balances} />
          </Stack>
        )}
      </ContentWrapper>
    </>
  );
};

AddressPage.getInitialProps = ctx => {
  const principal = getPrincipalFromCtx(ctx);
  return {
    principal,
    inView: {
      type: 'address',
      payload: principal,
    },
  };
};
export default withInitialQueries(AddressPage)(getAccountPageQueries);
