import * as React from 'react';
import { Box, Flex, FlexProps } from '@blockstack/ui';
import { Caption } from '@components/typography';
import { Card } from '@components/card';
import { toSnakeCase } from '@common/utils';
import { useHover } from 'use-events';
import { CopyIcon } from '@components/svg';

interface RowProps {
  card?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  copy?: string;
  label: {
    children: any;
  };
  render: any;
}

const RowWrapper: React.FC<FlexProps> = ({ borderColor = 'inherit', ...props }) => (
  <Flex
    direction={['column', 'column', 'row']}
    py={['base', 'base', 'loose']}
    width="100%"
    align={['unset', 'unset', 'center']}
    {...props}
    borderColor={borderColor}
  />
);

const RowLabel = ({ label, id }: { label: string; id: string }) => (
  <Box flexShrink={0} width="140px">
    <Caption id={id} aria-label={label} pb={['extra-tight', 'extra-tight', 'unset']}>
      {label}
    </Caption>
  </Box>
);
interface RowContentProps {
  isHovered: boolean;
  copy?: string;
}
const RowContent: React.FC<RowContentProps> = ({ children, isHovered, ...rest }) => (
  <Flex pr="base" width="100%" align="center" justify="space-between" {...rest}>
    <Flex
      color={isHovered ? 'blue' : undefined}
      textStyle="body.small.medium"
      style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}
      align="center"
    >
      {children}
    </Flex>
    <Box
      transition="75ms all ease-in-out"
      opacity={isHovered ? 1 : 0}
      color="ink.400"
      pl="base"
      ml="auto"
    >
      <CopyIcon />
    </Box>
  </Flex>
);

const Row: React.FC<RowProps> = ({ card, isFirst, isLast, label, render, copy }) => {
  const id = toSnakeCase(label.children);
  const [hovered, bind] = useHover();
  const isHovered = !!copy && hovered;
  return (
    <RowWrapper
      borderTop={isFirst && !card ? '1px solid' : undefined}
      borderBottom={isLast && card ? undefined : '1px solid'}
      px={card ? 'base' : 'unset'}
      cursor={isHovered ? 'pointer' : undefined}
      {...bind}
    >
      <RowLabel label={label.children} id={id} />
      <RowContent isHovered={isHovered} aria-labelledby={id}>
        {render}
      </RowContent>
    </RowWrapper>
  );
};

interface Item {
  label: {
    children: any;
  };
  children: any;
  copy?: string; // the value to copy
}

interface RowsProps {
  card?: boolean;
  childComponent?: React.FC<RowProps>;
  items: Item[];
}

export const Rows: React.FC<RowsProps> = ({ card, childComponent, items, ...props }) => {
  const Component = card ? Card : Box;
  const ChildComponent = childComponent || Row;
  return (
    <Component width="100%" {...props}>
      {items.map(({ label, children, copy }, key, arr) => (
        <ChildComponent
          card={card}
          isFirst={key === 0}
          isLast={key === arr.length - 1}
          label={label}
          render={children}
          key={key}
          copy={copy}
        />
      ))}
    </Component>
  );
};
