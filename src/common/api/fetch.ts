import { HIRO_HEADERS, withApiServer } from '@common/constants';

export const fetcher = (input: RequestInfo, init: RequestInit = {}) => {
  const initHeaders = init.headers || {};
  return fetch(input, {
    credentials: 'omit',
    ...init,
    headers: { ...initHeaders, ...HIRO_HEADERS },
  });
};

export const fetchFromApi =
  (apiServer: string) =>
  async (path: string, opts = {}) => {
    return fetcher(withApiServer(apiServer)(path), {
      ...opts,
    });
  };

export const fetchFromSidecar =
  (apiServer: string) =>
  async (path: string, opts = {}) => {
    return fetcher(withApiServer(apiServer)('/extended/v1' + path), {
      ...opts,
    });
  };

export const postToApi =
  (apiServer: string) =>
  async (path: string, opts = {}) =>
    fetchFromApi(apiServer)(path, { method: 'POST', ...opts, headers: HIRO_HEADERS });

export const postToSidecar =
  (apiServer: string) =>
  async (path: string, opts = {}) =>
    fetchFromSidecar(apiServer)(path, { method: 'POST', ...opts, headers: HIRO_HEADERS });
