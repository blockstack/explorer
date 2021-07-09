import * as React from 'react';
import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';
import { Box, color, DynamicColorCircle, Flex, FlexProps, Stack } from '@stacks/ui';
import { Caption, Text } from '@components/typography';
import { TxLink } from '@components/links';
import { getAssetNameParts } from '@common/utils';
import { getTicker } from '@components/tx-events';

interface TokenAssetListItemProps extends FlexProps {
  token: string;
  isLast: boolean;
  balances: AddressBalanceResponse;
  type: 'non_fungible_tokens' | 'fungible_tokens';
}

export const TokenAssetListItem: React.FC<TokenAssetListItemProps> = ({
  token,
  balances,
  type,
  isLast,
}) => {
  const { address, asset, contract } = getAssetNameParts(token);
  const key = type === 'non_fungible_tokens' ? 'count' : 'balance';
  return (
    <Flex justifyContent="space-between" px="base" py="base">
      <Box>
        <Flex alignItems="center" mb={'extra-tight'}>
          <DynamicColorCircle size="32px" mr="base" string={`${address}.${contract}::${asset}`}>
            {asset[0]}
          </DynamicColorCircle>
          <Stack spacing="extra-tight">
            <Text color={color('text-title')} fontWeight="600">
              {asset}
            </Text>
            <Stack isInline spacing="extra-tight" divider={<Caption>∙</Caption>}>
              <Caption>{getTicker(asset).toUpperCase()}</Caption>
              <TxLink txid={`${address}.${contract}`}>
                <Caption
                  target="_blank"
                  _hover={{
                    textDecoration: 'underline',
                  }}
                  as="a"
                >
                  View contract
                </Caption>
              </TxLink>
            </Stack>
          </Stack>
        </Flex>
      </Box>
      <Flex justifyContent="flex-end" alignItems="center" textAlign="right">
        <Text color={color('text-body')} textAlign="right">
          {key === 'balance'
            ? parseFloat((balances as any)[type][token][key]).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })
            : parseInt((balances as any)[type][token][key]).toLocaleString()}
        </Text>
      </Flex>
    </Flex>
  );
};
