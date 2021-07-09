import React, { useEffect } from 'react';
import { useFocus, useHover } from 'use-events';
import { BoxProps, useEventListener } from '@stacks/ui';
import { FoundResult, SearchResultType } from '@common/types/search-results';
import { AddressResultItem } from '@features/search/items/address-result-item';
import { TxResultItem } from '@features/search/items/tx-result-item';
import { BlockResultItem } from '@features/search/items/block-result-item';

interface SearchResultItemProps extends BoxProps {
  isLast: boolean;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  onClick?: (e?: any) => void;
  focused?: boolean;
  result: FoundResult;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  isLast,
  onFocus,
  onBlur,
  onClick,
  focused,
  result,
  ...rest
}) => {
  const [isHovered, bindHover] = useHover();
  const [isFocused, bindFocus] = useFocus();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [localFocus, setLocalFocus] = React.useState<boolean>(false);

  const handleFocus = (e?: React.FocusEvent) => {
    e?.preventDefault();
    onFocus?.(e);
    bindFocus.onFocus(e as any);
  };

  const handleBlur = (e?: React.FocusEvent) => {
    e?.preventDefault();
    onBlur?.(e);
    bindFocus.onBlur(e as any);
  };

  useEventListener('keydown', event => {
    if (event.key === 'Enter' && (focused || isFocused)) {
      onClick?.();
    }
  });

  useEffect(() => {
    if (focused && ref.current) {
      setLocalFocus(true);
      ref.current.focus?.();
      handleFocus();
    }
    if (!focused && localFocus && ref.current) {
      setLocalFocus(false);
      ref.current.blur?.();
      handleBlur();
    }
  }, [focused, ref]);

  const itemProps = {
    onFocus: handleFocus,
    onBlur: handleBlur,
    onClick,
    isLast,
    ...bindHover,
    isHovered,
    ref,
  };

  switch (result.result.entity_type) {
    case SearchResultType.BlockHash:
      return <BlockResultItem {...(itemProps as any)} {...rest} result={result} />;
    case SearchResultType.ContractAddress:
    case SearchResultType.MempoolTxId:
    case SearchResultType.TxId:
      return <TxResultItem {...(itemProps as any)} {...rest} result={result} />;
    case SearchResultType.StandardAddress:
      return <AddressResultItem {...(itemProps as any)} {...rest} result={result} />;
  }
};
