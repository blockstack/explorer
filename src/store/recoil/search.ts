import { SearchResult } from '@common/types/search';
import { convertAddress, getAddressDetails } from '@common/utils/addresses';

import { atom } from 'jotai';
import { atomFamily, atomWithStorage } from 'jotai/utils';
import { networkUrlState } from '@store/network';
import { networkModeState } from '@store/recoil/network';
import { FoundResult } from '@common/types/search-results';
import { searchQueryResultsAtom } from '@store/search';

export const searchQueryAtom = atom<string | null>(null);
export const searchQueryState = atom<string | null, string | null>(
  get => {
    return get(searchQueryAtom);
  },
  (get, set, newValue) => {
    const query = get(searchQueryAtom);
    const result = get(searchResultsState);
    if (query !== newValue) set(searchQueryAtom, newValue);
    if (newValue === '' || newValue === null) {
      if (!!result) set(searchResultsState, null);
    }
  }
);

export const searchValueState = atom<string>('');

export const searchExitingState = atom<boolean>(false);
export const searchLoadingState = atom<boolean>(false);
export const searchResultsState = atom<SearchResult | null>(null);

export const searchResultItemState = atomFamily(_param => atom(null));

export const searchFocusedState = atom<boolean>(false);

export const searchRecentlyViewedItemsState = atomWithStorage<
  Record<string, FoundResult & { viewedAt: string }>
>('recent_search_items', {});

export const searchDropdownState = atom<'hidden' | 'visible'>('hidden');

export const searchDropdownExitingState = atom<boolean>(false);

export const searchErrorSelector = atom(get => {
  const results = get(searchQueryResultsAtom);
  const query = get(searchQueryState);

  if (query && !results?.found && results?.error) {
    return results.error;
  }

  return null;
});

export const searchResultsSelector = atom(get => {
  const results = get(searchResultsState);
  const query = get(searchQueryState);

  if (query && !results?.found && results?.error) {
    return results.error;
  }

  return null;
});

export const searchDropdownVisibilitySelector = atom(get => {
  const apiServer = get(networkUrlState);
  const hasValue = get(searchValueState);
  const query = get(searchQueryState);
  const isFocused = get(searchFocusedState);
  const recentItems = get(searchRecentlyViewedItemsState);
  const keys =
    Object.keys(recentItems as any)?.filter(key => key?.startsWith(apiServer as string)) || [];
  const hasRecentItems = keys.length > 0;
  const hasResults = get(searchResultsState);
  const hasItem = get(searchResultItemState(hasResults?.found && hasResults.result.entity_id));

  if (isFocused) {
    if (!!hasValue || !!query) {
      return !!query || !!hasItem || hasRecentItems;
    }
    return hasRecentItems;
  }
  return false;
});

export const searchForAddressOfDifferentType = atom(get => {
  const results = get(searchResultsState);
  const networkMode = get(networkModeState);
  if (
    results &&
    results.found &&
    results?.result.entity_type === 'standard_address' &&
    results?.result?.entity_id
  ) {
    const details = getAddressDetails(results?.result?.entity_id);
    if (networkMode && networkMode !== details.network) {
      return convertAddress(results?.result?.entity_id, networkMode);
    }
    return false;
  }
});
export const searchBarFocus = atom(false);
export const searchBarHover = atom(false);
export const searchBarVisibility = atom<'hidden' | 'visible'>('hidden');
