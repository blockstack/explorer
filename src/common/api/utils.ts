import nookies from 'nookies';
import { NextPageContext } from 'next';
import { Transaction } from '@stacks/stacks-blockchain-api-types';
import {
  DEFAULT_MAINNET_SERVER,
  DEFAULT_NETWORK_INDEX,
  DEFAULT_NETWORK_LIST,
  DEFAULT_STATUS_ENDPOINT,
  DEFAULT_TESTNET_INDEX,
  DEFAULT_TESTNET_SERVER,
  DEFAULT_REGTEST_SERVER,
  DEFAULT_REGTEST_INDEX,
  MICROBLOCKS_ENABLED,
  MAINNET_MICROBLOCKS_SERVER,
  NETWORK_CURRENT_INDEX_COOKIE,
  NETWORK_LIST_COOKIE,
} from '@common/constants';
import { fetchFromApi } from '@common/api/fetch';
import { NetworkModes } from '@common/types/network';

/**
 * Get the api server in SSR contexts
 *
 * This function will check cookies to see if a user has:
 * a) selected a different index other than the default
 * b) a + has defined a custom network
 * c) use default server defined
 *
 * Additionally, the function will check and make sure the api server selected
 * is functioning, and if it is not, it will switch to whichever default
 * is online (mainnet/testnet)
 */
export const getServerSideApiServer = async (ctx: NextPageContext) => {
  if (MICROBLOCKS_ENABLED) return MAINNET_MICROBLOCKS_SERVER;
  const chain = ctx.query?.chain;
  const defaultApiServer = DEFAULT_NETWORK_LIST[DEFAULT_NETWORK_INDEX].url;
  // set it to our default network
  let apiServer = defaultApiServer;
  let changed = false;

  try {
    // check for cookies
    const cookies = nookies.get(ctx);
    const savedNetworkIndex = cookies[NETWORK_CURRENT_INDEX_COOKIE];
    const savedNetworkList = cookies[NETWORK_LIST_COOKIE];

    const savedIndexInt = savedNetworkIndex && parseInt(savedNetworkIndex);
    const hasSelectedIndex = typeof savedIndexInt === 'number';

    const hasCustomItems = !!savedNetworkList;

    // if there is a saved index, and it's less than the length of the built in list
    // meaning the user has saved one of the built in items, so pull from default list
    if (hasSelectedIndex && savedIndexInt && savedIndexInt < DEFAULT_NETWORK_LIST.length) {
      const INDEX = savedIndexInt;
      apiServer = DEFAULT_NETWORK_LIST[INDEX].url;
      changed = true;
    }
    // has saved list and has saved an index, and that index is greater than or equal to the
    // length of default list (meaning they are using a saved item as api server)
    else if (
      hasSelectedIndex &&
      hasCustomItems &&
      savedIndexInt &&
      savedIndexInt >= DEFAULT_NETWORK_LIST.length
    ) {
      const NETWORK_LIST = JSON.parse(savedNetworkList);
      const INDEX = savedIndexInt;
      const customServer = NETWORK_LIST[INDEX - DEFAULT_NETWORK_LIST.length]?.url;
      if (customServer) {
        apiServer = customServer;
        changed = true;
      }
    }
    // check the server works
    if (changed && apiServer) {
      try {
        const res = await fetchFromApi(apiServer)(DEFAULT_STATUS_ENDPOINT);
        const data = await res.json();
      } catch (e) {
        // if it fails, reset to default
        apiServer = defaultApiServer;
      }
    } else {
      // if nothing is set, and chain param is testnet, set it to testnet (for open graph rendering, etc)
      if (!savedNetworkIndex && chain === 'testnet') {
        apiServer = DEFAULT_NETWORK_LIST[DEFAULT_TESTNET_INDEX]?.url;
        nookies.set(ctx, NETWORK_CURRENT_INDEX_COOKIE, JSON.stringify(DEFAULT_TESTNET_INDEX), {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        });
      }
      // if nothing is set, and chain param is regtest, set it to regtest (for open graph rendering, etc)
      if (!savedNetworkIndex && chain === 'regtest') {
        apiServer = DEFAULT_NETWORK_LIST[DEFAULT_REGTEST_INDEX]?.url;
        nookies.set(ctx, NETWORK_CURRENT_INDEX_COOKIE, JSON.stringify(DEFAULT_REGTEST_INDEX), {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        });
      }
    }
    return apiServer;
  } catch (e) {
    return apiServer;
  }
};

export const constructLimitAndOffsetQueryParams = (limit: number, offset?: number): string =>
  `limit=${limit}${offset ? `&offset=${offset}` : ''}`;

export const generateTypesQueryString = (types?: Transaction['tx_type'][]) => {
  if (types?.length) {
    return `&${types
      .map(type => `${encodeURIComponent('type[]')}=${encodeURIComponent(type)}`)
      .join('&')}`;
  }
  return '';
};

export const getChainTypeFromUrl = (networkUrl: string | undefined) => {
  switch (networkUrl) {
    case DEFAULT_MAINNET_SERVER:
      return NetworkModes.Mainnet;
    case DEFAULT_TESTNET_SERVER:
      return NetworkModes.Testnet;
    case DEFAULT_REGTEST_SERVER:
      return NetworkModes.Regtest;
    default:
      return undefined;
  }
};
