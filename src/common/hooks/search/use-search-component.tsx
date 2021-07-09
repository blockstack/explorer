import * as React from 'react';
import { useRecentlyViewedItems } from '@common/hooks/search/use-recent-items';
import { useSearch } from '@common/hooks/search/use-search';
import { useHover } from 'web-api-hooks';
import { useAtomFocus } from '@common/hooks/use-atom-focus';
import { searchDropdownVisibilitySelector, searchFocusedState } from '@store/recoil/search';

import { useSearchFocus } from '@common/hooks/search/use-search-focus';
import { useAtomValue } from 'jotai/utils';

type Variant = 'default' | 'small';

export const useSearchComponent = ({
  variant,
  inputRef,
  timeoutRef,
}: {
  variant?: Variant;
  inputRef: any;
  timeoutRef: any;
  containerRef?: any;
}) => {
  const { recentItemsArray } = useRecentlyViewedItems();
  const [isHovered, bindHover] = useHover();
  const [isFocused] = useAtomFocus(searchFocusedState);
  const [_, __, { removeFocus }] = useSearchFocus();
  const isVisible = useAtomValue(searchDropdownVisibilitySelector);
  const {
    query,
    handleUpdateQuery,
    handleClearState,
    isLoading,
    exiting,
    handleSetExiting,
    value,
  } = useSearch(inputRef, timeoutRef);

  const spinnerVisible = query && isLoading;

  const isSmall = variant === 'small';
  const inputLeftOffset = isSmall ? '38px' : '50px';
  const inputRightOffset = spinnerVisible ? '92px' : '60px';
  const defaultHeight = isSmall ? '38px' : '64px';

  const hasRecentItems = !!recentItemsArray?.length;

  const handleClearResults = () => {
    inputRef?.current?.focus?.();
    handleClearState();
  };

  React.useEffect(() => {
    return () => handleClearState();
  }, []);

  const handleItemOnClick = React.useCallback(() => {
    handleClearState();
    removeFocus();
  }, [inputRef]);

  return {
    handleClearResults,
    handleItemOnClick,
    handleUpdateQuery,
    isSmall,
    inputLeftOffset,
    inputRightOffset,
    defaultHeight,
    hasRecentItems,
    isHovered,
    isFocused,
    inputRef,
    spinnerVisible,
    value,
    query,
    exiting,
    isVisible,
    handleClearState,
    handleSetExiting,
    isLoading,
    bindHover,
  };
};
