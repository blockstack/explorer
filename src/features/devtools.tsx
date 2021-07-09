import React, { memo } from 'react';
import { useAtomValue } from 'jotai/utils';
import { Provider } from 'jotai';
import { getQueryClientAtom, queryClientAtom } from 'jotai/query';
import { queryClient } from 'jotai-query-toolkit';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useDebugInView } from '../hooks/currently-in-view-hooks';

export const DevtoolsPanel = memo(() => {
  const queryClient = useAtomValue(getQueryClientAtom);
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
});

export const Devtools = () =>
  process.env.NODE_ENV === 'production' ? null : (
    <Provider initialValues={[[queryClientAtom, queryClient] as const]}>
      <DevtoolsPanel />
    </Provider>
  );
export const AtomDebug = () => {
  useDebugInView();
  return null;
};
