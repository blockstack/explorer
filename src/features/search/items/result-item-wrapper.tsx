import React from 'react';
import { Flex, FlexProps } from '@stacks/ui';
import { border } from '@common/utils';
import { forwardRefWithAs } from '@stacks/ui-core';
import { FloatingHoverIndicator } from '@components/hover-indicator';

export const ResultItemWrapper = forwardRefWithAs<
  FlexProps & { isHovered?: boolean; isLast: boolean },
  'a'
>(({ children, as = 'a', isHovered, isLast, ...rest }, ref) => {
  return (
    <Flex
      as={as}
      p="loose"
      alignItems="center"
      borderBottom={!isLast ? border() : 'unset'}
      position="relative"
      justifyContent="space-between"
      ref={ref}
      {...rest}
    >
      <FloatingHoverIndicator isHovered={isHovered} left="0" />
      <Flex flexGrow={1} alignItems="center" justifyContent="space-between">
        {children}
      </Flex>
    </Flex>
  );
});
