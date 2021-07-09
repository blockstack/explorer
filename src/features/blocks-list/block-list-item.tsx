import React from 'react';
import { Block } from '@stacks/stacks-blockchain-api-types';
import { useHoverableState } from '@components/hoverable';
import { BlockLink } from '@components/links';
import { Box, color, Flex, Stack } from '@stacks/ui';
import { ItemIcon } from '@components/item-icon';
import HashtagIcon from 'mdi-react/HashtagIcon';
import { Caption, Text, Title } from '@components/typography';
import { addSepBetweenStrings, toRelativeTime, truncateMiddle } from '@common/utils';
import pluralize from 'pluralize';

export const BlockItem: React.FC<{ block: Block; index: number; length: number }> = React.memo(
  ({ block, index, length, ...rest }) => {
    const isHovered = useHoverableState();
    return (
      <BlockLink hash={block.hash} {...rest}>
        <Flex
          justifyContent="space-between"
          py="loose"
          color={color('text-body')}
          _hover={{
            borderLeftColor: color('accent'),
          }}
          as="a"
          {...rest}
        >
          <Stack as="span" isInline alignItems="center" spacing="base">
            <ItemIcon type="block" />
            <Stack spacing="tight" as="span">
              <Flex color={color(isHovered ? 'brand' : 'text-title')} alignItems="center">
                <Box size="16px" as={HashtagIcon} mr="1px" opacity={0.5} color="currentColor" />
                <Title display="block" color="currentColor">
                  {String(block.height)}
                </Title>
              </Flex>
              <Caption display="block">
                {addSepBetweenStrings([
                  `${block?.txs?.length} ${pluralize('transactions', block?.txs?.length)}`,
                ])}
              </Caption>
            </Stack>
          </Stack>
          <Stack spacing="tight" textAlign="right" as="span">
            <Text
              fontSize="14px"
              width="100%"
              textAlign="right"
              color={color('text-body')}
              display="block"
            >
              {toRelativeTime(block.burn_block_time * 1000)}
            </Text>
            <Caption display="block">{truncateMiddle(block.hash)}</Caption>
          </Stack>
        </Flex>
      </BlockLink>
    );
  }
);
