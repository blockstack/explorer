import { atom } from 'recoil';

export const authResponseState = atom<null | string>({
  key: 'authResponse',
  default: null,
});
