import React from 'react';
import { RecoilRoot } from 'recoil';
import { AppContainer } from '@components/app-container';
import { CacheProvider } from '@emotion/react';
import { cache } from '@emotion/css';

interface AppConfigProps {
  isHome?: boolean;
  fullWidth?: boolean;
  dehydratedState?: any;
}

export const AppConfig: React.FC<AppConfigProps> = ({ children, isHome, fullWidth }) => (
  <RecoilRoot>
    <CacheProvider value={cache}>
      <AppContainer isHome={isHome} fullWidth={fullWidth}>
        {children}
      </AppContainer>
    </CacheProvider>
  </RecoilRoot>
);
