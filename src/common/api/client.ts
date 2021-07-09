import {
  Configuration,
  AccountsApi,
  SmartContractsApi,
  InfoApi,
  TransactionsApi,
  BlocksApi,
  FaucetsApi,
  BNSApi,
  BurnchainApi,
  FeesApi,
  SearchApi,
  RosettaApi,
} from '@stacks/blockchain-api-client';
import { NextPageContext } from 'next';
import { getServerSideApiServer } from '@common/api/utils';
import { fetcher as fetchApi } from '@common/api/fetch';
import type { Middleware, RequestContext } from '@stacks/blockchain-api-client';
import { MICROBLOCKS_ENABLED } from '@common/constants';

/**
 * Our mega api clients function. This is a combo of all clients that the blockchain-api-client package offers.
 * @param config - the `@stacks/blockchain-api-client` configuration object
 */
export function apiClients(config: Configuration) {
  const smartContractsApi = new SmartContractsApi(config);
  const accountsApi = new AccountsApi(config);
  const infoApi = new InfoApi(config);
  const transactionsApi = new TransactionsApi(config);
  const blocksApi = new BlocksApi(config);
  const faucetsApi = new FaucetsApi(config);
  const bnsApi = new BNSApi(config);
  const burnchainApi = new BurnchainApi(config);
  const feesApi = new FeesApi(config);
  const searchApi = new SearchApi(config);
  const rosettaApi = new RosettaApi(config);

  return {
    smartContractsApi,
    accountsApi,
    infoApi,
    transactionsApi,
    blocksApi,
    faucetsApi,
    bnsApi,
    burnchainApi,
    feesApi,
    searchApi,
    rosettaApi,
  };
}

// this is used to enable automatic passing of `unanchored=true` to all requests
const unanchoredMiddleware: Middleware = {
  pre: (context: RequestContext) => {
    const url = new URL(context.url);
    url.searchParams.set('unanchored', 'true');
    return Promise.resolve({
      init: context.init,
      url: url.toString(),
    });
  },
};

// we use to to create our api client config on both the server and client
export function createConfig(basePath: string) {
  const middleware: Middleware[] = [];
  if (MICROBLOCKS_ENABLED) middleware.push(unanchoredMiddleware);
  return new Configuration({
    basePath,
    fetchApi,
    middleware,
  });
}

// this is used in next.js specific data fetchers, typically only by getApiClients
// this will pass the correct network url as defined by cookie (or default value)
export const getApiClientConfig = async (context: NextPageContext): Promise<Configuration> => {
  const apiServer = await getServerSideApiServer(context);
  return createConfig(apiServer);
};
// this is used in next.js specific data fetchers to get all our api clients fetching from the correct network url
// only to be used in `getInitialProps` or other next.js data fetching methods
export const getApiClients = async (
  context: NextPageContext
): Promise<ReturnType<typeof apiClients>> => {
  const config = await getApiClientConfig(context);
  return apiClients(config);
};
