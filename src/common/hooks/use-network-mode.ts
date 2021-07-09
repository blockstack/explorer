import { NetworkMode } from '@common/types/network';
import { useAtomValue } from 'jotai/utils';
import { networkModeState } from '@store/recoil/network';

export const useNetworkMode = () => useAtomValue<NetworkMode>(networkModeState);
