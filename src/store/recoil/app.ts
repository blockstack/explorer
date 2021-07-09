import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { setDocumentStyles, THEME_STORAGE_KEY } from '@stacks/ui';
import type { ColorModeString } from '@stacks/ui';

export const _colorModeState = atomWithStorage<ColorModeString>(THEME_STORAGE_KEY, 'light');
export const colorModeState = atom<ColorModeString, ColorModeString>(
  get => {
    const saved = get(_colorModeState);
    setDocumentStyles(saved as ColorModeString);
    return saved;
  },
  (get, set, update) => {
    setDocumentStyles(update);
    set(_colorModeState, update);
  }
);
