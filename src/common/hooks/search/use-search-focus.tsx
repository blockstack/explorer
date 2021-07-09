import { searchFocusedState } from '@store/recoil/search';
import { useAtomFocus } from '@common/hooks/use-atom-focus';

export const useSearchFocus = () => {
  const results = useAtomFocus(searchFocusedState);
  return [...results];
};
