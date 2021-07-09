import { useAtomValue } from 'jotai/utils';
import { blocksSingleState } from '@store/blocks';
import { Caption, Text, Title } from '@components/typography';
import { addSepBetweenStrings, toRelativeTime, truncateMiddle } from '@common/utils';
import pluralize from 'pluralize';
import React from 'react';
import { color, Flex, FlexProps, Stack } from '@stacks/ui';
import { FoundResult } from '@common/types/search-results';
import { BlockLink } from '@components/links';
import { ItemIcon } from '@components/item-icon';
import { SafeSuspense } from '@components/ssr-safe-suspense';
import { ResultItemWrapper } from '@features/search/items/result-item-wrapper';

const BlocksCaption = ({ hash }: { hash: string }) => {
  const block = useAtomValue(blocksSingleState(hash));
  return (
    <Caption>
      {addSepBetweenStrings([`${block.txs.length} ${pluralize('transaction', block.txs.length)}`])}
    </Caption>
  );
};
export const BlockResultItem: React.FC<
  FlexProps & { isFocused?: boolean; isHovered?: boolean; isLast: boolean; result: FoundResult }
> = ({ isHovered, isFocused, result, ...props }) => {
  if (!result || result.result.entity_type !== 'block_hash') return null;
  return (
    <BlockLink hash={result.result.block_data.hash as string}>
      <ResultItemWrapper {...props}>
        <Flex alignItems="center">
          <ItemIcon type="block" />
          <Stack spacing="tight" ml="base">
            <Title color={isHovered ? color('accent') : color('text-title')} display="block">
              Block #{result.result.block_data.height}
            </Title>
            <SafeSuspense fallback={<Caption>Loading...</Caption>}>
              <BlocksCaption hash={result.result.block_data.hash as string} />
            </SafeSuspense>
          </Stack>
        </Flex>
        <Stack textAlign="right" justifyContent="flex-end" spacing="tight">
          <Text ml="tight" fontSize="14px" textAlign="right" color={color('text-body')}>
            {toRelativeTime((result.result.block_data.burn_block_time as number) * 1000)}
          </Text>
          <Caption>{truncateMiddle(result.result.block_data.hash as string)}</Caption>
        </Stack>
      </ResultItemWrapper>
    </BlockLink>
  );
};
