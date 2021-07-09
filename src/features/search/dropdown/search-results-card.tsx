import * as React from 'react';
import { Box, BoxProps, color, Flex, Spinner, transition } from '@stacks/ui';
import { Caption } from '@components/typography';
import { border } from '@common/utils';
import { useRecentlyViewedItems } from '@common/hooks/search/use-recent-items';
import { SearchErrorMessage } from '@features/search/dropdown/error-message';

import { searchErrorSelector, searchRecentlyViewedItemsState } from '@store/recoil/search';
import { InvertedAddressNote } from '@features/search/dropdown/inverted-address';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { searchQueryResultsAtom } from '@store/search';
import { Pending } from '@components/status';
import { ReactNode } from 'react';
import { SafeSuspense } from '@components/ssr-safe-suspense';
import { RecentlyViewedList } from '@features/search/dropdown/recently-viewed-list';
import { SearchResultItem } from '@features/search/items/search-result-item';
import { SearchResultsItemPlaceholder } from '@features/search/items/item-placeholder';
import { useSearchDropdown } from '@common/hooks/search/use-search-dropdown';

interface SearchResultsCardProps extends BoxProps {
  isLoading?: boolean;
  clearResults?: () => void;
  handleSetExiting?: () => void;
  handleItemOnClick?: () => void;
}

const SearchingIndicator: React.FC = React.memo(() => (
  <Flex alignItems="center">
    <Spinner size="sm" opacity={0.5} mr="tight" />
    <Caption>Searching</Caption>
  </Flex>
));

interface CardActionsProps {
  isLoading?: boolean;
  hasError?: boolean;
  hasResults?: boolean;
  hasRecent?: boolean;
  clearResults?: () => void;
}

const CardActions: React.FC<CardActionsProps> = ({
  isLoading,
  hasError,
  hasResults,
  clearResults,
  hasRecent,
}) => {
  const setRecent = useUpdateAtom(searchRecentlyViewedItemsState);
  return (
    <Box opacity={isLoading || hasResults || hasError || hasRecent ? 1 : 0} transition={transition}>
      {isLoading ? (
        <SearchingIndicator />
      ) : hasError || hasResults ? (
        <Caption
          as="button"
          border="0"
          bg="transparent"
          _hover={{ cursor: 'pointer', color: color('brand') }}
          onClick={clearResults}
        >
          Clear {hasResults ? 'results' : 'error'}
        </Caption>
      ) : hasRecent ? (
        <Caption
          as="button"
          border="0"
          bg="transparent"
          _hover={{ cursor: 'pointer', color: color('brand') }}
          onClick={() => setRecent({} as any)}
        >
          Clear recent
        </Caption>
      ) : null}
    </Box>
  );
};

const SearchResultsCardWrapper: React.FC<BoxProps & { title?: string; actions?: ReactNode }> = ({
  title,
  actions,
  children,
  ...rest
}) => {
  return (
    <Box
      borderRadius="12px"
      mt="base"
      bg={color('bg')}
      color={color('text-caption')}
      position="absolute"
      width="100%"
      zIndex={99}
      boxShadow="high"
      border={border()}
      overflow="auto"
      {...rest}
    >
      <Flex
        borderBottom={border()}
        justifyContent="space-between"
        alignItems="center"
        px="base"
        height="48px"
      >
        {title && <Caption>{title}</Caption>}

        {actions && actions}
      </Flex>
      <>{children}</>
    </Box>
  );
};

export const SearchResultsCardPlaceholder = (props: BoxProps) => {
  return (
    <SearchResultsCardWrapper title="Searching" actions={<SearchingIndicator />} {...props}>
      <Flex p="base" flexGrow={1}>
        <Pending size="16px" />
        <Caption ml="loose">Searching the network...</Caption>
      </Flex>
    </SearchResultsCardWrapper>
  );
};

export const SearchResultsCard: React.FC<SearchResultsCardProps> = ({
  isLoading,
  clearResults,
  handleItemOnClick,
  ...rest
}) => {
  const { handleMakeHidden } = useSearchDropdown();
  const data = useAtomValue(searchQueryResultsAtom);
  const { recentItemsArray, handleUpsertItem } = useRecentlyViewedItems();
  const error = useAtomValue(searchErrorSelector);

  const hasError = !!error || (data && !data?.found);
  const hasResults = !hasError && data?.found;
  const hasRecent = recentItemsArray?.length > 0;

  const getTitle = React.useMemo(() => {
    if (hasError) {
      return 'Not found';
    }
    if (hasResults) {
      return 'Search results';
    }
    if (hasRecent) {
      return 'Recently viewed';
    }
  }, [hasError, hasResults, hasRecent]);

  return (
    <SearchResultsCardWrapper
      title={getTitle}
      actions={
        <CardActions
          hasError={hasError}
          hasResults={hasResults}
          hasRecent={hasRecent}
          isLoading={isLoading}
          clearResults={clearResults}
        />
      }
      {...rest}
    >
      <>
        {error ? (
          <SearchErrorMessage message={error} />
        ) : data && data.found ? (
          <>
            <InvertedAddressNote />
            <SafeSuspense fallback={<SearchResultsItemPlaceholder result={data} isLast />}>
              <SearchResultItem
                result={data}
                onClick={() => {
                  handleUpsertItem(data);
                  handleItemOnClick?.();
                  handleMakeHidden();
                }}
                isLast
              />
            </SafeSuspense>
          </>
        ) : hasRecent ? (
          <RecentlyViewedList itemOnClick={handleItemOnClick} />
        ) : null}
      </>
    </SearchResultsCardWrapper>
  );
};
