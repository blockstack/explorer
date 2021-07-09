import { atomFamilyWithQuery, atomWithQuery } from 'jotai-query-toolkit';
import { apiClientsState } from '@store/api-clients';
import { searchQueryAtom, searchQueryState } from '@store/recoil/search';

import type { FoundResult, NotFoundResult, SearchResult } from '@common/types/search-results';
import { atom } from 'jotai';
import { SearchResultType } from '@common/types/search-results';
import { blocksSingleState } from '@store/blocks';
import { contractInfoState } from '@store/contracts';
import { transactionSingleState } from '@store/transactions';
import { accountInfoState, accountTransactionsState } from '@store/accounts';
import { DEFAULT_LIST_LIMIT } from '@common/constants';

export const searchAtomWithQuery = atomFamilyWithQuery<string, SearchResult | undefined>(
  'SEARCH',
  async (get, query) => {
    const { searchApi } = get(apiClientsState);
    if (!query) return;
    try {
      const result = await searchApi.searchById({ id: query });
      return result as FoundResult;
    } catch (e) {
      try {
        const data = await e.json();
        if (data && 'found' in data) return data as NotFoundResult;
      } catch (e) {
        return undefined;
      }
    }
  }
);

export const searchQueryResultsAtom = atom(get => {
  const query = get(searchQueryAtom);
  if (!query) return;
  return get(searchAtomWithQuery(query));
});

export const searchResultItemState = atom(get => {
  const result = get(searchQueryResultsAtom);
  if (!result || !result.found) return;
  const { entity_id } = result.result;
  switch (result.result.entity_type) {
    case SearchResultType.BlockHash:
      return get(blocksSingleState(entity_id));
    case SearchResultType.ContractAddress:
      return get(contractInfoState(entity_id));
    case SearchResultType.MempoolTxId:
    case SearchResultType.TxId:
      return get(transactionSingleState(entity_id));
    case SearchResultType.StandardAddress:
      return {
        info: get(accountInfoState(entity_id)),
        transactions: get(accountTransactionsState([entity_id, DEFAULT_LIST_LIMIT])),
      };
  }
});
