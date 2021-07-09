import * as React from 'react';
import { Stack } from '@stacks/ui';

import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';

import { PageTop } from '@components/page';
import { TransactionDetails } from '@components/transaction-details';
import { ContractSource } from '@components/contract-source';
import { PostConditions } from '@components/post-conditions';
import { Events } from '@components/tx-events';
import { ContractDetails } from '@components/contract-details';
import { BtcAnchorBlockCard } from '@components/btc-anchor-card';
import { PagePanes } from '@components/page-panes';
import { FunctionSummarySection } from '@components/function-summary/function-summary';
import {
  useAccountInViewBalances,
  useAccountInViewTransactions,
  useBlockInView,
  useContractInfoInView,
  useContractSourceInView,
  useTransactionInView,
} from '../../hooks/currently-in-view-hooks';

const ContractCallPage = () => {
  const transaction = useTransactionInView();
  const block = useBlockInView();
  const source = useContractSourceInView();
  const info = useContractInfoInView();
  const btc = null;

  if (!transaction || transaction.tx_type !== 'contract_call') return null;
  const isPending = transaction.tx_status === 'pending';
  return (
    <>
      <PageTop tx={transaction as any} />
      <PagePanes
        fullWidth={info || !!source ? false : transaction.tx_status === 'pending' || block === null}
      >
        <Stack spacing="extra-loose">
          <TransactionDetails transaction={transaction} />
          {'events' in transaction && transaction.events && (
            <Events txId={transaction.tx_id} events={transaction.events} />
          )}
          <FunctionSummarySection
            isPending={isPending}
            result={transaction.tx_result}
            summary={transaction.contract_call as ContractCallTransaction['contract_call']}
            btc={btc}
          />
          <PostConditions
            conditions={transaction.post_conditions}
            mode={transaction.post_condition_mode}
          />
          {source && (
            <ContractSource
              sourceTx={transaction.contract_call.contract_id}
              source={source}
              contractCall={transaction.contract_call}
            />
          )}
        </Stack>
        <Stack spacing="extra-loose">
          {info && (
            <ContractDetails
              contractId={transaction.contract_call.contract_id}
              contractInterface={info}
            />
          )}
          {!isPending && block && <BtcAnchorBlockCard block={block} />}
        </Stack>
      </PagePanes>
    </>
  );
};

export default ContractCallPage;
