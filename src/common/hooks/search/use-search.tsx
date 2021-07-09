import * as React from 'react';

import debounce from 'just-debounce-it';

import {
  searchQueryState,
  searchExitingState,
  searchLoadingState,
  searchValueState,
} from '@store/recoil/search';
import { useAtom } from 'jotai';

export const useSearch = (ref: any, isLoadingTimeoutRef: any) => {
  const [query, handleSetQuery] = useAtom(searchQueryState);
  const [value, setValue] = useAtom(searchValueState);
  const [exiting, handleSetExiting] = useAtom(searchExitingState);
  const [isLoading] = useAtom(searchLoadingState);

  const resetValue = () => {
    setValue('');
    handleSetQuery(null);
  };

  const handleExiting = React.useCallback(() => {
    resetValue();
    handleSetExiting(true);
  }, [handleSetExiting]);

  const handleClearState = React.useCallback(() => {
    resetValue();
  }, [handleSetQuery, ref]);

  const debouncedSetQuery = React.useCallback(
    debounce((query: string | null) => {
      handleSetQuery(query);
    }, 500),
    [handleSetQuery]
  );

  const handleUpdateQuery = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const v = e.currentTarget.value;
      setValue(v);
      debouncedSetQuery(v);
    },
    [debouncedSetQuery]
  );

  return {
    value,
    setValue,
    resetValue,
    query,
    handleSetQuery,
    handleExiting,
    handleUpdateQuery,
    handleClearState,
    handleSetExiting,
    exiting,
    isLoading,
  };
};
