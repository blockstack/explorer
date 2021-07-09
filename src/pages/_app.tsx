import React from 'react';

import { Devtools } from '@features/devtools';
import { AppConfig } from '@components/app-config';

import type { AppProps } from 'next/app';
import type { NetworkModes } from '@common/types/network';

import 'tippy.js/dist/tippy.css';
import 'modern-normalize/modern-normalize.css';

interface ExporerAppProps extends AppProps {
  networkMode: NetworkModes;
  apiServer: string;
}

function App({
  Component,
  pageProps: { isHome, fullWidth, dehydratedState, ...props },
  networkMode,
}: ExporerAppProps) {
  return (
    <>
      <Devtools />
      <AppConfig isHome={isHome} fullWidth={fullWidth}>
        <Component networkMode={networkMode} {...props} />
      </AppConfig>
    </>
  );
}

export default App;
