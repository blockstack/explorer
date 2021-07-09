import React from 'react';
import { ColorModeProvider, ThemeProvider } from '@stacks/ui';
import { ProgressBar } from '@components/progress-bar';
import { PageWrapper } from '@components/page';

export const AppWrapper: React.FC<{ isHome?: boolean; fullWidth?: boolean }> = React.memo(props => (
  <ThemeProvider>
    <ColorModeProvider defaultMode="light">
      <ProgressBar />
      <PageWrapper {...props} />
    </ColorModeProvider>
  </ThemeProvider>
));
