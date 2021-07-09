import React from 'react';
import { SearchModal } from '@components/modals/search';
import { NetworkSwitchModal } from '@components/modals/add-network';
import { DifferentNetworkModal } from '@components/modals/different-network';
import { UnlockingScheduleModal } from '@components/modals/unlocking-schedule';
import { SafeSuspense } from '@components/ssr-safe-suspense';

export const Modals: React.FC = () => {
  return (
    <SafeSuspense fallback={<></>}>
      <SearchModal />
      <NetworkSwitchModal />
      <DifferentNetworkModal />
      <UnlockingScheduleModal />
    </SafeSuspense>
  );
};
