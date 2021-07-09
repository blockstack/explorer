import { fetchFromSidecar } from '@common/api/fetch';
import type { Microblock } from '@stacks/stacks-blockchain-api-types';

/**
 * Fetch a microblock
 *
 * @param {string} apiServer - the current apiServer
 */
export const fetchMicroblock =
  (apiServer: string) =>
  async (hash: Microblock['microblock_hash']): Promise<Microblock> => {
    const resp = await fetchFromSidecar(apiServer)(`/microblock/${hash}`);

    const microblock = await resp.json();
    if (!resp.ok) {
      throw Error(microblock.error);
    }

    return microblock;
  };
