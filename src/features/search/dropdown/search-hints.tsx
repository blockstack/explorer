import * as React from 'react';
import { Flex, FlexProps, IconButton } from '@stacks/ui';
import { Tooltip } from '@components/tooltip';
import { IconQuestionMark } from '@tabler/icons';

interface SearchHintsProps extends FlexProps {
  isHovered?: boolean;
  isSmall?: boolean;
}

const SearchHints: React.FC<SearchHintsProps> = React.memo(({ isHovered, isSmall, ...rest }) => (
  <Flex
    alignItems="center"
    height="100%"
    top={0}
    px="base"
    position="absolute"
    right={`calc(calc(${isSmall ? '28px' : '36px'} + 24px) * -1)`}
    {...rest}
  >
    <Tooltip
      label="Available search terms: principal, tx_id, contract_id, and block_hash."
      placement={isSmall ? 'bottom-end' : 'top-end'}
      interactive
      labelProps={{
        minWidth: '350px',
      }}
    >
      <IconButton
        size={isSmall ? '28px' : '36px'}
        iconSize={isSmall ? '16px' : '20px'}
        invert
        color="white"
        _hover={{ cursor: 'unset' }}
        icon={IconQuestionMark}
      />
    </Tooltip>
  </Flex>
));

export default SearchHints;
