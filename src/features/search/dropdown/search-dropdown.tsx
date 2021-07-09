import * as React from 'react';
import { Fade } from '@stacks/ui';
import {
  SearchResultsCard,
  SearchResultsCardPlaceholder,
} from '@features/search/dropdown/search-results-card';
import { useSearchComponent } from '@common/hooks/search/use-search-component';
import { SafeSuspense } from '@components/ssr-safe-suspense';

type Variant = 'default' | 'small';

export const SearchDropdown = ({
  variant,
  inputRef,
  timeoutRef,
  containerRef,
}: {
  variant?: Variant;
  inputRef: any;
  timeoutRef: any;
  containerRef: any;
}) => {
  const {
    handleClearResults,
    handleItemOnClick,
    query,
    exiting,
    isVisible,
    handleClearState,
    handleSetExiting,
    isLoading,
  } = useSearchComponent({
    variant,
    inputRef,
    timeoutRef,
    containerRef,
  });
  return (
    <Fade
      in={isVisible}
      onExited={() => {
        if (exiting) {
          handleClearState();
          handleSetExiting(false);
        }
        if (!query) {
          handleClearState();
        }
      }}
    >
      {styles => (
        <SafeSuspense fallback={<SearchResultsCardPlaceholder style={styles} />}>
          <SearchResultsCard
            handleItemOnClick={handleItemOnClick}
            clearResults={handleClearResults}
            isLoading={isLoading}
            style={styles}
          />
        </SafeSuspense>
      )}
    </Fade>
  );
};
