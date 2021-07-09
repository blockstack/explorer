import { atomWithDefault } from 'jotai/utils';
import { networkCurrentUrlSelector } from '@store/recoil/network';

export const networkUrlState = atomWithDefault<string | null>(get =>
  get(networkCurrentUrlSelector)
);
