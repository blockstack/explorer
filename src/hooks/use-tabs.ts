import { useAtom } from 'jotai';
import { tabIndexState } from '@store/ui';

export const useTabs = (key: string) => {
  const [currentIndex, setCurrentIndex] = useAtom(tabIndexState(key));
  return {
    currentIndex,
    setCurrentIndex,
  };
};
