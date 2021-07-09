import { useAtomValue } from 'jotai/utils';
import { networkUrlState } from '@store/network';

export const useApiServer = (): string => {
  const network = useAtomValue(networkUrlState);
  return network as string;
};
