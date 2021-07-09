import { Box, BoxProps, color, Stack, transition } from '@stacks/ui';
import * as React from 'react';
import { memo } from 'react';
import { useHover } from 'web-api-hooks';
import { useTabs } from '../hooks/use-tabs';
import { SECTION_HEADER_HEIGHT } from '@common/constants/sizes';
import { Caption } from '@components/typography';
import { capitalize } from '@common/utils';

interface TabProps extends BoxProps {
  tab: string;
  index: number;
  stateKey: string;
  defaultIndex?: number;
}

interface TabIndicatorProps extends BoxProps {
  isHovered?: boolean;
  isActive?: boolean;
}

const TabActiveIndicator: React.FC<TabIndicatorProps> = memo(({ isHovered, isActive, ...rest }) => (
  <Box
    height="1px"
    width="100%"
    opacity={isActive ? 0.75 : isHovered ? 1 : 0}
    bg={color(isActive ? 'text-title' : 'brand')}
    position="absolute"
    bottom="-1px"
    transform={isActive || isHovered ? 'none' : 'scaleX(0)'}
    transition={transition}
    {...rest}
  />
));

const Tab: React.FC<TabProps> = memo(({ tab, index, _hover = {}, stateKey, ...rest }) => {
  const [isHovered, bind] = useHover();
  const { currentIndex, setCurrentIndex } = useTabs(stateKey);
  const isActive = index === currentIndex;
  const hoverProps = isActive
    ? {
        ..._hover,
      }
    : {
        cursor: 'pointer',
        color: color('brand'),
        ..._hover,
      };
  return (
    <Box
      as="button"
      display="flex"
      alignItems="center"
      justifyContent="center"
      outline={0}
      border={0}
      px="base-loose"
      bg="transparent"
      onClick={() => setCurrentIndex(index)}
      color={isActive ? color('text-title') : color('text-caption')}
      _hover={hoverProps}
      position="relative"
      height={SECTION_HEADER_HEIGHT}
      {...bind}
      {...rest}
    >
      <Caption opacity={isActive ? 1 : 0.85} fontSize={2} fontWeight={500} color="currentColor">
        {capitalize(tab)}
      </Caption>
      <TabActiveIndicator isActive={isActive} isHovered={isHovered} />
    </Box>
  );
});

export const Tabs = memo(
  ({
    defaultIndex,
    tabs,
    stateKey,
  }: {
    defaultIndex?: number;
    tabs: string[];
    stateKey: string;
  }) => {
    return (
      <Stack isInline spacing="0">
        {tabs.map((tab, index) => (
          <Tab
            stateKey={stateKey}
            defaultIndex={defaultIndex}
            tab={tab}
            index={index}
            key={index}
          />
        ))}
      </Stack>
    );
  }
);
