import { ChainID } from '@stacks/transactions';
import getConfig from 'next/config';
import { Transaction } from '@stacks/stacks-blockchain-api-types';

const { publicRuntimeConfig } = getConfig();

const config = publicRuntimeConfig;

const getNumber = (query?: string): number | undefined =>
  query && typeof parseInt(query) === 'number' ? parseInt(query) : undefined;

export const DEFAULT_POLLING_INTERVAL =
  getNumber(
    config?.NEXT_PUBLIC_DEFAULT_POLLING_INTERVAL || process.env.NEXT_PUBLIC_DEFAULT_POLLING_INTERVAL
  ) || 10000; // 10 seconds :c

export const REGTEST_CHAIN_ID = ChainID.Testnet;
export const TESTNET_CHAIN_ID = ChainID.Testnet;
export const MAINNET_CHAIN_ID = ChainID.Mainnet;

export const IS_DEV = process.env.NODE_ENV !== 'production';
export const IS_BROWSER = typeof document !== 'undefined';

export const STACKS_EXPLORER_APP_ICON =
  'https://blockstack-www.imgix.net/stacks-explorer-icon.png?auto=format&w=72';

export const DEFAULT_STATUS_ENDPOINT = '/extended/v1/status';
export const DEFAULT_V2_INFO_ENDPOINT = '/v2/info';

export const SITE_NOTICE_BANNER_LABEL =
  config?.NEXT_PUBLIC_SITE_NOTICE_BANNER_LABEL || process.env.NEXT_PUBLIC_SITE_NOTICE_BANNER_LABEL;

export const SITE_NOTICE_BANNER_MESSAGE =
  config?.NEXT_PUBLIC_SITE_NOTICE_BANNER_MESSAGE ||
  process.env.NEXT_PUBLIC_SITE_NOTICE_BANNER_MESSAGE;
export const SITE_NOTICE_ENABLED = SITE_NOTICE_BANNER_LABEL && SITE_NOTICE_BANNER_MESSAGE;

export const APP_DETAILS = {
  name: 'Stacks Explorer',
  icon: STACKS_EXPLORER_APP_ICON,
};
export const DEPLOYMENT_URL =
  config?.NEXT_PUBLIC_DEPLOYMENT_URL ||
  process.env.NEXT_PUBLIC_DEPLOYMENT_URL ||
  `https://${process.env.VERCEL_URL}`;

export const LEGACY_EXPLORER_API_SERVER =
  config?.NEXT_PUBLIC_LEGACY_EXPLORER_API_SERVER ||
  process.env.NEXT_PUBLIC_LEGACY_EXPLORER_API_SERVER ||
  'https://explorer-api.legacy.blockstack.org';

export const CONNECT_AUTH_ORIGIN =
  config?.NEXT_PUBLIC_CONNECT_AUTH_ORIGIN ||
  process.env.NEXT_PUBLIC_CONNECT_AUTH_ORIGIN ||
  'https://pr-725.app.stacks.engineering';

export const DEFAULT_TESTNET_SERVER =
  config?.NEXT_PUBLIC_TESTNET_API_SERVER ||
  process.env.NEXT_PUBLIC_TESTNET_API_SERVER ||
  'https://stacks-node-api.testnet.stacks.co';

export const DEFAULT_REGTEST_SERVER =
  config?.NEXT_PUBLIC_REGTEST_API_SERVER ||
  process.env.NEXT_PUBLIC_REGTEST_API_SERVER ||
  'https://stacks-node-api.regtest.stacks.co';

export const DEFAULT_MAINNET_SERVER =
  config?.NEXT_PUBLIC_MAINNET_API_SERVER ||
  process.env.NEXT_PUBLIC_MAINNET_API_SERVER ||
  'https://stacks-node-api.stacks.co';

// TODO: Remove before deployment
export const MAINNET_MICROBLOCKS_SERVER = 'https://stacks-node-api-microblocks.stacks.co';

export const VERSION = config?.VERSION || process.env.VERSION;

export const NETWORK_LIST_COOKIE = 'STACKS_EXPLORER_NETWORK_LIST';
export const NETWORK_CURRENT_INDEX_COOKIE = 'STACKS_EXPLORER_NETWORK_CURRENT_INDEX';
export const DEFAULT_REGTEST_INDEX = 2;
export const DEFAULT_TESTNET_INDEX = 1;
export const DEFAULT_MAINNET_INDEX = 0;
export const DEFAULT_NETWORK_INDEX = DEFAULT_MAINNET_INDEX;

export const DEFAULT_NETWORK_LIST = [
  {
    label: 'stacks.co',
    url: DEFAULT_MAINNET_SERVER,
  },
  {
    label: 'stacks.co',
    url: DEFAULT_TESTNET_SERVER,
  },
  {
    label: 'stacks.co',
    url: DEFAULT_REGTEST_SERVER,
  },
  {
    label: 'localhost',
    url: 'http://localhost:3999',
  },
];

export enum MODALS {
  SEARCH = 'modals/search',
  NETWORK = 'modals/add-network',
  DIFFERENT_NETWORK = 'modals/different-network',
  UNLOCKING_SCHEDULE = 'modals/unlocking-schedule',
}

type ReverseMap<T extends Record<keyof T, any>> = {
  [V in T[keyof T]]: {
    [K in keyof T]: T[K] extends V ? K : never;
  }[keyof T];
};

const reverseMap: ReverseMap<typeof MODALS> = Object.entries(MODALS).reduce((rMap, [k, v]) => {
  rMap[v] = k;
  return rMap;
}, {} as any);

export type AllModals = keyof typeof reverseMap;

export const withApiServer = (apiServer: string) => (path?: string) =>
  path ? apiServer + path : apiServer;

export const POX_ADDRESS = 'SP000000000000000000002Q6VF78';

export const HIRO_HEADERS: HeadersInit = {
  'x-hiro-product': 'explorer',
  'x-hiro-version': VERSION,
};

export const QueryRefreshRates: Record<'Default' | 'None', number | false> = {
  Default: DEFAULT_POLLING_INTERVAL,
  None: false,
};

export const DEFAULT_LIST_LIMIT_SMALL = 10;
export const DEFAULT_LIST_LIMIT = 30;
export const MICROBLOCKS_ENABLED = false;

export const TransactionType = {
  SMART_CONTRACT: 'smart_contract' as Transaction['tx_type'],
  CONTRACT_CALL: 'contract_call' as Transaction['tx_type'],
  TOKEN_TRANSFER: 'token_transfer' as Transaction['tx_type'],
  COINBASE: 'coinbase' as Transaction['tx_type'],
  POISON_MICROBLOCK: 'poison_microblock' as Transaction['tx_type'],
} as const;
