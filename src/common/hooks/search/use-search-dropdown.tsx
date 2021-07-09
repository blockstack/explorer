import * as React from 'react';

import { searchDropdownState } from '@store/recoil/search';
import { useAtom } from 'jotai';

export const useSearchDropdown = () => {
  const [searchDropdown, setSearchDropdown] = useAtom(searchDropdownState);

  const handleMakeVisible = () => {
    setSearchDropdown('visible');
  };

  const handleMakeHidden = () => {
    setSearchDropdown('hidden');
  };

  const isVisible = searchDropdown === 'visible';
  const isHidden = searchDropdown === 'hidden';

  return {
    isVisible,
    isHidden,
    handleMakeVisible,
    handleMakeHidden,
  };
};
