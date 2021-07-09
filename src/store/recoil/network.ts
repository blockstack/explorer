import { atom } from 'jotai';
import { DEFAULT_NETWORK_INDEX, DEFAULT_NETWORK_LIST } from '@common/constants';

export const networkModeState = atom(null);

export const customNetworksListState = atom<{ label: string; url: string }[]>([]);

export const networkListState = atom(get => {
  const customItems = get(customNetworksListState);
  return [...DEFAULT_NETWORK_LIST, ...customItems];
});

export const networkIndexState = atom(DEFAULT_NETWORK_INDEX);

export const networkCurrentSelector = atom(get => {
  const index = get(networkIndexState);
  const list = get(networkListState);
  return list[index];
});

export const networkCurrentUrlSelector = atom(get => get(networkCurrentSelector).url);

export const networkSwitchingState = atom<'idle' | 'pending'>('idle');
