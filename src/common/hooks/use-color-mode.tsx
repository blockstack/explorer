import * as React from 'react';
import type { ColorModeString } from '@stacks/ui';
import { getInvertedValue } from '@stacks/ui';
import { colorModeState } from '@store/recoil/app';
import { useAtom } from 'jotai';

export const useColorMode = (): [colorMode: ColorModeString, toggleColorMode: () => void] => {
  const [colorMode, setColorMode] = useAtom<ColorModeString, ColorModeString>(colorModeState);
  const toggleColorMode = () => setColorMode(getInvertedValue(colorMode) as ColorModeString);
  return [colorMode, toggleColorMode];
};
