import React, { memo } from 'react';
import { Box, BoxProps, Flex, color, Stack, transition } from '@stacks/ui';
import { FiInfo } from 'react-icons/fi';

interface SubheaderProps {
  subtitle: string;
}

export const Subheader = memo<SubheaderProps>(props => {
  return (
    <Box
      borderBottom="1px solid"
      borderBottomColor="var(--colors-border)"
      position="relative"
      height="52px"
      width="100%"
      py="16px"
    >
      <Box as="span" mr="extra-tight" fontWeight={500} fontSize="14px" lineHeight="20px">
        {props.subtitle}
      </Box>
      <Box size="12px" as={FiInfo} color={'#757B83'} />
    </Box>
  );
});
