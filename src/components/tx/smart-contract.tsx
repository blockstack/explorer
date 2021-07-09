import * as React from 'react';
import { Box, Stack } from '@stacks/ui';
import { TransactionList } from '@components/transaction-list';
import { StxBalances } from '@components/balances/stx-balance-card';
import { ContractSource } from '@components/contract-source';
import { PageTop } from '@components/page';
import { TransactionDetails } from '@components/transaction-details';
import { PostConditions } from '@components/post-conditions';
import { getContractName, isPendingTx } from '@common/utils';
import { Events } from '@components/tx-events';
import { PagePanes } from '@components/page-panes';
import { BtcAnchorBlockCard } from '@components/btc-anchor-card';
import { TokenBalancesCard } from '@components/balances/principal-token-balances';
import { hasStxBalance, hasTokenBalance } from '@common/utils/accounts';
import {
  useAccountInViewBalances,
  useBlockInView,
  useContractSourceInView,
  useTransactionInView,
} from '../../hooks/currently-in-view-hooks';
import { AccountTransactionList } from '@features/account-transaction-list';

const SmartContractPage = () => {
  const transaction = useTransactionInView();
  const block = useBlockInView();
  const source = useContractSourceInView();
  const balances = useAccountInViewBalances();

  if (!transaction || transaction.tx_type !== 'smart_contract') return null;

  return (
    <>
      <PageTop tx={transaction} />
      <PagePanes fullWidth={isPendingTx(transaction) || block === null}>
        <Stack spacing="extra-loose">
          <TransactionDetails
            contractName={getContractName(transaction.smart_contract.contract_id)}
            transaction={transaction}
          />
          {'events' in transaction && (
            <Events txId={transaction.tx_id} events={transaction.events} />
          )}
          <PostConditions
            mode={transaction.post_condition_mode}
            conditions={transaction.post_conditions}
          />
          {source && <ContractSource source={source} />}
          <AccountTransactionList />
        </Stack>
        <Box>
          {block && <BtcAnchorBlockCard mb="extra-loose" block={block} />}
          {balances && (
            <>
              {hasStxBalance(balances) && (
                <Box mb={block ? 'extra-loose' : 'unset'}>
                  <StxBalances
                    balances={balances}
                    unlocking={{ found: false }}
                    hasHadVesting={false}
                  />
                </Box>
              )}
              {hasTokenBalance(balances) && <TokenBalancesCard balances={balances} />}
            </>
          )}
        </Box>
      </PagePanes>
    </>
  );
};

export default SmartContractPage;
