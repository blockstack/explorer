import { NextPage, NextPageContext } from 'next';
import React, { useMemo } from 'react';
import {
  getInitialPropsFromQueries,
  Queries,
  GetQueries,
  QueryPropsGetter,
} from 'jotai-query-toolkit/nextjs';
import { initialDataAtom, queryClient } from 'jotai-query-toolkit';
import { queryClientAtom } from 'jotai/query';
import { Atom } from 'jotai/core/atom';
import { Provider } from 'jotai';
import { InView } from '@store/currently-in-view';
import { setCurrentlyInView } from '@common/set-currently-in-view';
import { hashQueryKey } from 'react-query';
import { AtomDebug } from '@features/devtools';
import { getServerSideApiServer } from '@common/api/utils';
import { getNetworkMode } from '@common/api/network';
import { networkModeState } from '@store/recoil/network';
import { NetworkModes } from '@common/types/network';
import { Modals } from '@components/modals';

export function useQueryInitialValues(props: Record<string, unknown>) {
  const queryKeys = Object.keys(props);
  const atoms = queryKeys.map(queryKey => {
    const value = props[queryKey];
    if (!value)
      throw Error('[Jotai Query Toolkit] no initial data found for ${hashQueryKey(queryKey)}');
    return [initialDataAtom(queryKey), value] as const;
  });
  return [[queryClientAtom, queryClient] as const, ...atoms] as Iterable<
    readonly [Atom<unknown>, unknown]
  >;
}

export function withInitialQueries<QueryProps = unknown, PageProps = Record<string, unknown>>(
  WrappedComponent: NextPage<PageProps>
) {
  return (
    getQueries: Queries<QueryProps> | GetQueries<QueryProps>,
    getQueryProps?: QueryPropsGetter<QueryProps>
  ): NextPage<PageProps> => {
    if (!getQueries) throw Error('Need to pass queries');

    const Wrapper: NextPage<{
      initialQueryData: Record<string, unknown>;
      inView?: InView;
      networkUrl: string;
      networkMode?: NetworkModes;
    }> = ({ initialQueryData, inView, networkUrl, networkMode, ...props }) => {
      const initialQueries = useQueryInitialValues(initialQueryData);
      const keys = Object.keys(initialQueryData);
      // this key is very important, without passing key={key} to the Provider,
      // it won't know to re-render if someone navigates within the same page component (eg from one address to another)
      const key = useMemo(() => hashQueryKey(keys), [keys]);
      const initialValues = [...initialQueries]
        .concat(inView ? [setCurrentlyInView(inView.type, inView.payload)] : [])
        .concat([[networkModeState, networkMode] as const]);

      return (
        <Provider initialValues={initialValues} key={key}>
          <AtomDebug />
          <WrappedComponent {...(props as PageProps)} />
          <Modals />
        </Provider>
      );
    };

    Wrapper.getInitialProps = async (ctx: NextPageContext) => {
      const networkUrl = await getServerSideApiServer(ctx);
      const networkMode = await getNetworkMode(networkUrl);
      const promises = [
        await getInitialPropsFromQueries<QueryProps>({
          getQueries,
          getQueryProps,
          ctx,
          queryClient,
        }),
      ];
      if (WrappedComponent.getInitialProps) {
        const asyncGetInitialProps = async () =>
          (await WrappedComponent?.getInitialProps?.(ctx)) || {};
        promises.push(asyncGetInitialProps());
      }

      const [initialQueryData, componentProps] = await Promise.all(promises);

      return {
        key: hashQueryKey(Object.keys(initialQueryData)),
        initialQueryData,
        networkUrl,
        networkMode,
        ...componentProps,
      };
    };

    return Wrapper as unknown as NextPage<PageProps>;
  };
}
