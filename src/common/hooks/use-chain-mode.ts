import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useModal } from '@common/hooks/use-modal';
import { useNetworkMode } from '@common/hooks/use-network-mode';
import { IS_BROWSER } from '@common/constants';
import { NetworkMode, NetworkModes } from '@common/types/network';

import { networkSwitchingState } from '@store/recoil/network';
import { useAtomValue } from 'jotai/utils';

type ChainMode = NetworkMode | undefined;
type SetChainMode = (mode: ChainMode) => Promise<void>;

// kind of like useState, but for the query param state
export const useChainMode = (): [ChainMode, SetChainMode] => {
  const router = useRouter();

  const setChainMode = async (chain: ChainMode) => {
    const params = router.query || {};

    if (router.query.chain) {
      delete params.chain;
    }
    await router.replace(
      {
        pathname: router.pathname,
        query: {
          ...params,
          chain,
        },
      },
      `${router.pathname}?chain=${chain}`,
      { shallow: true }
    );
  };

  return [router.query.chain as ChainMode, setChainMode];
};

// checks if there is a chain query param
// if not, add the current mode
// if there is, but not one of two options, set current mode
export const useChainModeEffect = () => {
  const { handleOpenDifferentNetworkModal } = useModal();
  const networkMode = useNetworkMode();
  const [chainMode, setChainMode] = useChainMode();
  const networkModeChangeState = useAtomValue(networkSwitchingState);

  const isRegtest = chainMode === NetworkModes.Regtest;
  const isTestnet = chainMode === NetworkModes.Testnet;
  const isMainnet = chainMode === NetworkModes.Mainnet;

  useEffect(() => {
    if (IS_BROWSER && networkMode && networkModeChangeState !== 'pending') {
      if (!chainMode || (!isTestnet && !isMainnet && !isRegtest)) {
        void setChainMode(networkMode);
      }
    }
  }, [chainMode, networkMode, IS_BROWSER, networkModeChangeState]);

  useEffect(() => {
    if (IS_BROWSER) {
      if (
        chainMode &&
        chainMode.includes('test') !== networkMode?.includes('test') &&
        networkModeChangeState !== 'pending'
      ) {
        // alert if url is different than what is returned by api server, unless it is on regtest
        // in the future we can have the modal display all servers added that match a given chain id
        handleOpenDifferentNetworkModal();
      }
    }
  }, [networkMode, IS_BROWSER]);
};

// sometimes you just need the setter
// so you don't have to do `const [_, setter] = hook();`
export const useSetChainMode = (): SetChainMode => {
  return useChainMode()[1];
};
