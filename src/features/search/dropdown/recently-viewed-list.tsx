import * as React from 'react';
import { useRecentlyViewedItems } from '@common/hooks/search/use-recent-items';
import { SearchResultItem } from '@features/search/items/search-result-item';
import { SafeSuspense } from '@components/ssr-safe-suspense';
import { SearchResultsItemPlaceholder } from '@features/search/items/item-placeholder';
import { useSearchDropdown } from '@common/hooks/search/use-search-dropdown';

export const RecentlyViewedList: React.FC<{
  clearResults?: () => void;
  itemOnClick?: () => void;
}> = React.memo(({ itemOnClick }) => {
  const { recentItemsArray } = useRecentlyViewedItems();
  const { handleMakeHidden } = useSearchDropdown();

  return (
    <>
      {recentItemsArray?.map((result, index) => (
        <SafeSuspense fallback={<SearchResultsItemPlaceholder result={result} />}>
          <SearchResultItem
            onClick={() => {
              itemOnClick?.();
              handleMakeHidden();
            }}
            key={index}
            result={result}
            isLast={index === recentItemsArray.length - 1}
          />
        </SafeSuspense>
      ))}
    </>
  );
});
