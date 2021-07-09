import * as React from 'react';
import { Box, color, Flex, Button } from '@stacks/ui';
import { Text } from '@components/typography';
import { border } from '@common/utils';

import {
  searchForAddressOfDifferentType,
  searchValueState,
  searchQueryState,
  searchFocusedState,
} from '@store/recoil/search';
import { useNetworkMode } from '@common/hooks/use-network-mode';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';

export const InvertedAddressNote: React.FC = () => {
  const networkMode = useNetworkMode();
  const setValue = useUpdateAtom(searchValueState);
  const setQuery = useUpdateAtom(searchQueryState);
  const setFocus = useUpdateAtom(searchFocusedState);
  const invertedAddress = useAtomValue(searchForAddressOfDifferentType);
  return invertedAddress ? (
    <Box p="base">
      <Flex alignItems="center" justifyContent="space-between" border={border()} p="base">
        <Text fontSize={1} color={color('text-body')} mr="base">
          This is a <strong>{networkMode === 'testnet' ? 'mainnet' : 'testnet'} address</strong>, do
          you want to search for the <strong>{networkMode}</strong> version instead?
        </Text>
        <Button
          as="div"
          size="sm"
          fontSize={1}
          onClick={() => {
            setQuery(invertedAddress);
            setValue(invertedAddress);
            setFocus(true);
          }}
        >
          Search
        </Button>
      </Flex>
    </Box>
  ) : null;
};
