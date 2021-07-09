import { HIRO_HEADERS, MICROBLOCKS_ENABLED, withApiServer } from '@common/constants';

export const fetcher = (input: RequestInfo, init: RequestInit = {}) => {
  const initHeaders = init.headers || {};
  return fetch(input, {
    credentials: 'omit',
    ...init,
    headers: { ...initHeaders, ...HIRO_HEADERS },
  });
};

export const appendUrlParam = (url: string, key: string, value: string) => {
  const [baseUrl, searchParams] = url.split('?');
  const urlSearchParams = new URLSearchParams(searchParams);
  urlSearchParams.append(key, value);
  return baseUrl + '?' + urlSearchParams.toString();
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
    const newPath = MICROBLOCKS_ENABLED ? appendUrlParam(path, 'unanchored', 'true') : path;
    return fetcher(withApiServer(apiServer)('/extended/v1' + newPath), {
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
