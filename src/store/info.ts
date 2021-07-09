import { atomWithQuery } from 'jotai-query-toolkit';
import { apiClientsState } from '@store/api-clients';
import { atom } from 'jotai';

const infoStateAtom = atomWithQuery(
  'StacksInfoState',
  get => {
    const { infoApi } = get(apiClientsState);
    return infoApi.getCoreApiInfo();
  },
  { refetchInterval: false, getShouldRefetch: () => false }
);

export const currentStacksHeight = atom(get => get(infoStateAtom).stacks_tip_height);
