import { fetchFromSidecar } from '@common/api/fetch';

import type { ContractInterfaceResponse } from '@stacks/stacks-blockchain-api-types';
import type { Contract, ContractResponse } from '@common/types/tx';

export const fetchContract =
  (apiServer: string) =>
  async (contract_id: string): Promise<Contract | { error: string }> => {
    const resp = await fetchFromSidecar(apiServer)(`/contract/${contract_id}`);
    const data: ContractResponse = await resp.json();
    if ('abi' in data) {
      return {
        ...data,
        abi: JSON.parse(data.abi) as ContractInterfaceResponse,
      };
    }
    return data as any;
  };
