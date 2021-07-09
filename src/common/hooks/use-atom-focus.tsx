import React from 'react';
import { useFocusWithin } from '@common/hooks/use-focus-within';
import { PrimitiveAtom, useAtom } from 'jotai';

export function useAtomFocus(
  atom: PrimitiveAtom<boolean>
): [boolean, any, { removeFocus: () => void }] {
  const [isFocused, setIsFocused] = useAtom(atom);

  const ref = React.useRef({
    isFocusWithin: false,
  });

  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: setIsFocused,
    ref,
  });

  const removeFocus = () => {
    setIsFocused(false);
    ref.current.isFocusWithin = false;
  };

  return [isFocused, focusWithinProps, { removeFocus }];
}
