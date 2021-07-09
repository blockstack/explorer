import { useAtomValue } from 'jotai/utils';
import { blocksListState } from '@store/blocks';
import { DEFAULT_LIST_LIMIT_SMALL } from '@common/constants';

export function useBlocksList(limit = DEFAULT_LIST_LIMIT_SMALL) {
  return useAtomValue(blocksListState(limit));
}
