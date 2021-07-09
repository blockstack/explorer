import * as React from 'react';
import { TransactionMeta } from '@components/meta/transactions';
import { TransactionPageComponent } from '@components/transaction-page-component';
import { getTxPageQueries, getTxPageQueryProps } from '@common/page-queries/txid';

import { getTxIdFromCtx } from '@common/utils';
import { withInitialQueries } from '@common/with-initial-queries';

import type { NextPage, NextPageContext } from 'next';

import type { TxPageQueryProps } from '@common/page-queries/txid';
import { useRefreshOnBack } from '../../hooks/use-refresh-on-back';

const TransactionPage: NextPage = () => {
  useRefreshOnBack('txid');
  return (
    <React.Fragment>
      <TransactionMeta />
      <TransactionPageComponent />
    </React.Fragment>
  );
};

TransactionPage.getInitialProps = (ctx: NextPageContext) => {
  const payload = getTxIdFromCtx(ctx);
  const type = payload.includes('.') ? 'contract_id' : 'tx';
  return {
    inView: { type, payload },
    key: payload,
  };
};

export default withInitialQueries<TxPageQueryProps>(TransactionPage)(
  getTxPageQueries,
  getTxPageQueryProps
);
