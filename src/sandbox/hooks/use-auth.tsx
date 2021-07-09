import { useCallback, useEffect, useState } from 'react';
import useConstant from 'use-constant';
import debounce from 'awesome-debounce-promise';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import {
  authOptionsAtom,
  isSignedInSelector,
  pendingSignInState,
  userDataAtom,
  userSession,
} from '@sandbox/store/sandbox';
import { authResponseState } from '@store/recoil/auth';
import type { AuthOptions, FinishedAuthData } from '@stacks/connect';
import { IS_BROWSER } from '@common/constants';
import { useRouter } from 'next/router';

export const useAuthState = () => {
  const isSignedIn = useRecoilValue<boolean>(isSignedInSelector);
  const [authOptions, setAuthOptions] = useRecoilState<Partial<AuthOptions>>(authOptionsAtom);
  const [authResponse, setAuthResponse] = useRecoilState(authResponseState);
  const [userData, setUserData] = useRecoilState(userDataAtom);
  const resetUserData = useResetRecoilState(userDataAtom);

  const handleSetAuthResponse = (_authResponse: string) => {
    setAuthResponse(_authResponse);
  };

  return {
    isSignedIn: !!userData,
    userData,
    setUserData,
    authOptions,
    setAuthOptions,
    userSession: authOptions.userSession,
    resetUserData,
    authResponse,
    setAuthResponse: handleSetAuthResponse,
  };
};

export const useAuth = () => {
  const pendingSignIn = useRecoilValue(pendingSignInState);
  const { setUserData, authResponse } = useAuthState();
  const router = useRouter();

  // we are using useConstant and debounce because it seems connect fires this fn many times
  // https://github.com/blockstack/ux/issues/444
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const onFinish = useConstant(() =>
    debounce((payload: FinishedAuthData) => {
      const userData = payload.userSession.loadUserData();
      setUserData(userData);
    }, 350)
  );

  const handlePendingSignIn = useCallback(async () => {
    if (authResponse) {
      try {
        const userData = await userSession.handlePendingSignIn(authResponse);
        setUserData(userData);
      } catch (e) {
        console.error(e.message);
      }
    }
    if (router.query.authResponse) {
      const params = router.query;
      delete params.authResponse;
      await router.replace(
        {
          pathname: router.pathname,
          query: {
            ...params,
          },
        },
        {
          pathname: router.pathname,
          query: {
            ...params,
          },
        },
        { shallow: true }
      );
    }
  }, [
    IS_BROWSER,
    IS_BROWSER && document.location.search,
    userSession,
    authResponse,
    router,
    setUserData,
  ]);

  useEffect(() => {
    if (pendingSignIn) {
      void handlePendingSignIn();
    }
  }, [pendingSignIn, handlePendingSignIn]);
};
