import React, { useEffect } from 'react';
import type { NextPage, NextPageContext } from 'next';
import Head from 'next/head';
import { SandboxPageContent } from '@sandbox/components/page-content';
import { Goals, useFathomGoal } from '@common/hooks/use-fathom';

const Sandbox: NextPage<SandboxData> = props => {
  const { handleTrackGoal } = useFathomGoal();

  useEffect(() => {
    handleTrackGoal(Goals.SANDBOX_LOAD);
  }, []);

  return (
    <>
      <Head>
        <title>Sandbox - Stacks 2.0 explorer</title>
      </Head>
      <SandboxPageContent {...props} />
    </>
  );
};

export function getServerSideProps(ctx: NextPageContext): { props: SandboxData } {
  const { query } = ctx;
  const param = query?.param ? query.param : [];
  let view = 'deploy';

  // only allow one of the available views
  if (['contract-call', 'transfer', 'faucet', 'deploy'].indexOf(param[0]) >= 0) {
    view = param[0];
  }

  const sender = param[1] || '';
  const contract = param[2] || '';

  return {
    props: { view, sender, contract },
  };
}

export interface SandboxData {
  view: string;
  sender: string;
  contract: string;
}

export default Sandbox;
