import React from 'react';
import { color, Spinner, Stack } from '@stacks/ui';
import { border } from '@common/utils';
import { FoundResult, SearchResultType } from '@common/types/search-results';
import { ItemIcon } from '@components/item-icon';

export const SearchResultsItemPlaceholder = ({
  result,
  isLast,
}: {
  result: FoundResult;
  isLast?: boolean;
}) => {
  const type = (): 'tx' | 'block' | 'principal' => {
    switch (result.result.entity_type) {
      case SearchResultType.StandardAddress:
        return 'principal';
      case SearchResultType.TxId:
      case SearchResultType.MempoolTxId:
      case SearchResultType.ContractAddress:
        return 'tx';
      default:
        return 'block';
    }
  };
  return (
    <Stack
      isInline
      spacing="base"
      borderBottom={!isLast ? border() : 'unset'}
      alignItems="center"
      p="loose"
      height="96px"
      bg={color('bg')}
      width="100%"
      css={{
        '.spinner': {
          borderStyle: 'solid',
        },
      }}
    >
      <ItemIcon type={type()} />
      <Spinner className="spinner" size="sm" color={color('text-caption')} />
    </Stack>
  );
};
