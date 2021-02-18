import { atom } from 'recoil';

export const functionCallViewState = atom<'initial' | 'function-overview'>({
  key: 'sandbox.function-call.view',
  default: 'initial',
});

export const rightPanelState = atom<'hidden' | 'showing'>({
  key: 'sandbox.right-panel.visibility',
  default: 'hidden',
});
