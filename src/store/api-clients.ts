import { atom } from 'jotai';
import { Configuration } from '@stacks/blockchain-api-client';
import {
  DEFAULT_MAINNET_SERVER,
  MAINNET_MICROBLOCKS_SERVER,
  MICROBLOCKS_ENABLED,
} from '@common/constants';
import { apiClients, createConfig } from '@common/api/client';
import { networkUrlState } from '@store/network';

export const apiClientConfiguration = atom<Configuration>(get => {
  const networkUrl = get(networkUrlState); // this should always be defined
  const apiServer = MICROBLOCKS_ENABLED
    ? MAINNET_MICROBLOCKS_SERVER
    : networkUrl || DEFAULT_MAINNET_SERVER;
  return createConfig(apiServer);
});

export const apiClientsState = atom(get => {
  const config = get(apiClientConfiguration);
  return apiClients(config);
});
