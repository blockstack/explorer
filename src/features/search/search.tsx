import * as React from 'react';
import { Box, BoxProps } from '@stacks/ui';

import { SearchDropdown } from '@features/search/dropdown/search-dropdown';
import { SearchBox } from '@features/search/search-field/search-box';
import { useSearchFocus } from '@common/hooks/search/use-search-focus';
import { SafeSuspense } from '@components/ssr-safe-suspense';

type Variant = 'default' | 'small';

export const SearchComponent: React.FC<BoxProps & { variant?: Variant }> = ({
  variant,
  ...props
}) => {
  const containerRef = React.useRef<any>(null);
  const inputRef = React.useRef<any>(null);
  const isLoadingTimeoutRef = React.useRef<number | null>(null);
  const [_, bind] = useSearchFocus();
  return (
    <Box position="relative" ref={containerRef} {...props} {...bind}>
      <SafeSuspense fallback={<></>}>
        <SearchBox timeoutRef={isLoadingTimeoutRef} inputRef={inputRef} variant={variant} />
      </SafeSuspense>
      <SafeSuspense fallback={<></>}>
        <SearchDropdown
          containerRef={containerRef}
          timeoutRef={isLoadingTimeoutRef}
          inputRef={inputRef}
          variant={variant}
        />
      </SafeSuspense>
    </Box>
  );
};
