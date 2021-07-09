import * as React from 'react';

import { searchRecentlyViewedItemsState } from '@store/recoil/search';
import { useApiServer } from '@common/hooks/use-api';
import { useAtom } from 'jotai';
import { FoundResult } from '@common/types/search-results';

export const useRecentlyViewedItems = () => {
  const apiServer = useApiServer();
  const [recentItems, setRecentItems] = useAtom(searchRecentlyViewedItemsState);

  const makeKey = (id: string) => `${apiServer}__${id}`;

  const handleUpsertItem = React.useCallback(
    data => {
      setRecentItems({
        ...recentItems,
        [makeKey(data.result.entity_id)]: { ...data, viewedAt: new Date().toISOString() },
      });
    },
    [recentItems, setRecentItems]
  );

  const keys = Object.keys(recentItems).filter(key => key.includes(apiServer));

  const recentItemsArray = keys
    .map(key => recentItems[key])
    .sort((a, b) => -a?.viewedAt?.localeCompare(b?.viewedAt));

  const hasRecentItems = recentItemsArray.length > 0;

  return {
    handleUpsertItem,
    recentItems,
    recentItemsArray,
    setRecentItems,
    hasRecentItems,
  };
};
