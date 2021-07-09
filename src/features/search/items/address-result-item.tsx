import React from 'react';
import { Box, color, Flex, FlexProps } from '@stacks/ui';
import { FoundResult } from '@common/types/search-results';
import { useAtomValue } from 'jotai/utils';
import { accountStxBalanceResponseState, accountTransactionsState } from '@store/accounts';
import { useInfiniteQueryAtom } from 'jotai-query-toolkit';
import { DEFAULT_LIST_LIMIT } from '@common/constants';
import { addSepBetweenStrings, microToStacks, truncateMiddle } from '@common/utils';
import pluralize from 'pluralize';
import { AddressLink } from '@components/links';
import { ItemIcon } from '@components/item-icon';
import { Caption, Title } from '@components/typography';
import { ResultItemWrapper } from '@features/search/items/result-item-wrapper';

export const AddressResultItem: React.FC<
  FlexProps & { isHovered?: boolean; isLast: boolean; result: FoundResult }
> = ({ isHovered, result, ...props }) => {
  if (!result || !result.found || result.result.entity_type !== 'standard_address') return null;
  const principal = result.result.entity_id;
  const stx = useAtomValue(accountStxBalanceResponseState(principal));
  const [transactions, { isFetchingNextPage }] = useInfiniteQueryAtom(
    accountTransactionsState([principal, DEFAULT_LIST_LIMIT])
  );
  const transactionTotal = transactions?.pages?.[0]?.total;
  const caption = addSepBetweenStrings([
    `${microToStacks(stx.balance)} STX`,
    `${transactionTotal} ${pluralize('transaction', transactionTotal)}`,
  ]);
  return (
    <AddressLink principal={principal}>
      <ResultItemWrapper {...props}>
        <Flex alignItems="center">
          <ItemIcon type="principal" />
          <Box ml="base">
            <Title
              color={isHovered ? color('accent') : color('text-title')}
              display="block"
              mb="extra-tight"
            >
              {truncateMiddle(principal, 4)}
            </Title>
            <Caption>{caption}</Caption>
          </Box>
        </Flex>
      </ResultItemWrapper>
    </AddressLink>
  );
};
