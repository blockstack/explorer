import { atomFamily, atom, selectorFamily, selector } from 'recoil';
import { AuthOptions, UserData, AppConfig, UserSession } from '@stacks/connect';
import { generateRandomName } from '@common/hooks/use-random-name';
import { helloWorldContract } from '@sandbox/common/contracts';
import { callReadOnlyFunction, fetchContractInterface } from '@sandbox/common';
import { SampleContracts } from '@sandbox/common/examples';
import { StacksTestnet } from '@stacks/network';
import { APP_DETAILS } from '@common/constants';
import { authResponseState } from '@store/recoil/auth';

export const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const authOptionsAtom = atom<Partial<AuthOptions>>({
  key: 'authOptions',
  default: {
    manifestPath: '/manifest.json',
    redirectTo: '/sandbox',
    userSession: userSession as any,
    appDetails: APP_DETAILS,
  },
});

const userDataEffect = ({ setSelf }: any) => {
  const isSignedIn = userSession.isUserSignedIn();
  if (isSignedIn) {
    setSelf(userSession.loadUserData());
  }
};

export const userDataAtom = atom<UserData | undefined>({
  key: 'sandbox.userData',
  default: undefined,
  effects_UNSTABLE: [userDataEffect],
});

export const pendingSignInState = selector({
  key: 'auth.pending',
  get: ({ get }) => {
    const authResponse = get(authResponseState);
    const userData = get(userDataAtom);
    if (authResponse && !userData) {
      return true;
    }
  },
});

export const isSignedInSelector = selector({
  key: 'auth.isSignedIn',
  get: ({ get }) => {
    return userSession.isUserSignedIn();
  },
});

export const codeBodyState = atom({
  key: 'sandbox.contract-editor-value',
  default: helloWorldContract.source,
});

export const contractNameState = atom({
  key: 'sandbox.contract-name-value',
  default: generateRandomName(),
});

export const tabState = atom<'deploy' | 'call' | 'transfer' | 'faucet'>({
  key: 'sandbox.view',
  default: 'deploy',
});

export const txPanelState = atom<'visible' | 'hidden'>({
  key: 'sandbox.tx-panel',
  default: 'visible',
});

export const txDetailsState = atomFamily<'hidden' | 'visible', string>({
  key: 'sandbox.txDetails',
  default: 'hidden',
});

export const txContractStateError = atom({
  key: 'sandbox.txDetails.error',
  default: undefined,
});

// @ts-ignore
export const txContractState = selectorFamily<any, { apiServer: string; contractId: string }>({
  key: 'sandbox.txDetails',
  get:
    ({ apiServer, contractId }) =>
    async () => {
      const data = await fetchContractInterface(apiServer)(
        contractId.split('.')[0],
        contractId.split('.')[1]
      );
      if (data.error) {
        throw data.error;
      }
      return {
        ...data,
        abi: JSON.parse(data.abi),
      };
    },
});

export const functionNameState = atom({
  key: 'sandbox.contract-call.function-name',
  default: undefined,
});

export const toolsState = atom<'hidden' | 'visible'>({
  key: 'sandbox.tools',
  default: 'hidden',
});

export const contractSearchQueryState = atom({
  key: 'sandbox.contract-call.search',
  default: '',
});

export const currentFunctionState = atom<string | undefined>({
  key: 'sandbox.contract-call.current-function',
  default: undefined,
});
export const contractCallViewState = atom<'search' | 'fn'>({
  key: 'sandbox.contract-call.view',
  default: 'search',
});

export const clarityWasmAtom = atom({
  key: 'sandbox.clarityWasm',
  default: undefined,
});

export const replResultState = atom({
  key: 'sandbox.repl',
  default: undefined,
});

export const editorToolsState = atom({
  key: 'sandbox.deploy.tools',
  default: 'hidden',
});

export const faucetResponseState = atom({
  key: 'sandbox.faucet.response',
  default: undefined,
});

export const codeEditorState = atomFamily({
  key: 'codeEditor',
  default: (principal: string) =>
    SampleContracts[0].source.replace('SM2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQVX8X0G', principal),
});

export const readOnlyState = atom({
  key: 'sandbox.contract-call.read-only',
  default: undefined,
});

export const readOnlyResponseState = selectorFamily<any, any>({
  key: 'sandbox.contract-call.read-only.response',
  get:
    ({
      contractName,
      contractAddress,
      functionName,
      functionArgs = [],
      senderAddress,
      apiServer,
    }) =>
    () => {
      const network = new StacksTestnet();
      network.coreApiUrl = apiServer;
      return callReadOnlyFunction({
        contractName,
        contractAddress,
        functionName,
        functionArgs,
        network,
        senderAddress,
      });
    },
});
