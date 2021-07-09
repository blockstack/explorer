import React from 'react';
import { Box, Flex, Stack, color, Grid, Fade, Transition, GridProps } from '@stacks/ui';
import { Title } from '@components/typography';
import { border } from '@common/utils';
import { Toggle } from '@components/toggle';
import { IconButton } from '@components/icon-button';
import CheckboxBlankCircleOutlineIcon from 'mdi-react/CheckboxBlankCircleOutlineIcon';
import { Tag } from '@components/tags';
import CloseIcon from 'mdi-react/CloseIcon';
import { useHover } from 'use-events';
import CheckboxMarkedCircleOutlineIcon from 'mdi-react/CheckboxMarkedCircleOutlineIcon';
import { blue } from '@components/button';
import { FilterIcon } from '@components/icons/filter';
import { Badge } from '@components/badge';
import { Text } from '@components/typography';
import { useFilterState } from '@common/hooks/use-filter-state';
import { TransactionType } from '@common/constants';

const FILTERABLE_TYPES = [
  TransactionType.SMART_CONTRACT,
  TransactionType.CONTRACT_CALL,
  TransactionType.TOKEN_TRANSFER,
  TransactionType.COINBASE,
];

export const FilteredMessage: React.FC<{ filterKey: 'sandbox' | 'txList' } & GridProps> = ({
  filterKey,
  ...rest
}) => {
  const { handleOpen } = useFilterState(filterKey);
  return (
    <Grid p="extra-loose" placeItems="center" textAlign="center" {...rest}>
      <Box>
        <Grid
          mx="auto"
          placeItems="center"
          size="72px"
          borderRadius="100%"
          color={color('text-title')}
          mb="base-loose"
          bg={blue(0.3)}
        >
          <Box color={color('accent')} transform="translateY(2px)" size="48px">
            <FilterIcon size="48px" />
          </Box>
        </Grid>
        <Title mb="tight" fontSize="20px">
          Transactions filtered
        </Title>
        <Text maxWidth="30ch" mx="auto" lineHeight="1.8" color={color('text-body')}>
          You have confirmed transactions, but they aren't currently visible due to your filter
          settings.
        </Text>
        <Flex alignItems="center" justifyContent="center" mx="auto" mt="base">
          <Badge
            _hover={{ cursor: 'pointer', bg: color('bg-alt') }}
            border={border()}
            color={color('text-body')}
            onClick={handleOpen}
          >
            Change filters
          </Badge>
        </Flex>
      </Box>
    </Grid>
  );
};

const CheckableElement = ({ type, value: toggled, onClick, ...rest }: any) => {
  const [isHovered, bind] = useHover();
  const handleClick = () => {
    onClick?.([type, !toggled]);
  };

  const Icon = toggled ? CheckboxMarkedCircleOutlineIcon : CheckboxBlankCircleOutlineIcon;

  return (
    <Flex
      onClick={handleClick}
      _hover={{ cursor: 'pointer' }}
      alignItems="center"
      {...bind}
      {...rest}
    >
      <IconButton
        color={toggled ? color('accent') : color('text-caption')}
        isHovered={isHovered}
        mr="tight"
        icon={Icon}
        size="24px"
        iconSize="16px"
        dark
      />
      <Tag border={border()} type={type} />
    </Flex>
  );
};

export const FilterPanel = React.memo(
  ({ filterKey, hideBackdrop, showBorder, bg, pointerEvents, ...rest }: any) => {
    const { handleClose, types, handleUpdateTypes, showing } = useFilterState(filterKey);

    const borderStyles = showBorder
      ? {
          border: border(),
        }
      : {};

    return (
      <Flex
        height="100%"
        width="100%"
        maxWidth="100vw"
        left={['unset', 'unset', 0, 0]}
        right={['-10px', '-10px', 'unset', 'unset']}
        flexGrow={1}
        position="absolute"
        top="35px"
        overflowY="hidden"
        flexDirection="column"
        px="extra-loose"
        pointerEvents="none"
        {...rest}
      >
        <Transition
          timeout={{ enter: 50, exit: 150 }}
          styles={{
            init: {
              transform: 'translateY(-100%)',
            },
            entered: { transform: 'translateY(0)', opacity: 1 },
            exiting: {
              transform: 'translateY(0)',
              opacity: '0',
            },
          }}
          in={!!showing}
        >
          {styles => (
            <Box
              zIndex={100}
              p="base"
              pb="loose"
              top="1px"
              bg={bg}
              width="100%"
              borderRadius="0 0 16px 16px"
              willChange="transform, opacity"
              style={styles}
              boxShadow="high"
              pointerEvents="all"
              transition={`280ms cubic-bezier(0.4, 0, 0.2, 1)`}
              transitionProperty="opacity, transform"
              {...borderStyles}
            >
              <Box
                position="absolute"
                top={'-48px'}
                left="0"
                width="100%"
                bg={color('bg')}
                height="50px"
              />
              <Flex pb="base" alignItems="center" justifyContent="space-between">
                <Title>Filter transactions</Title>
                <IconButton onClick={handleClose} dark icon={CloseIcon} />
              </Flex>
              <Flex justifyContent="flex-start">
                <Stack alignItems="flex-start" spacing="base" mr="base">
                  {[FILTERABLE_TYPES[0], FILTERABLE_TYPES[1]].map(type => (
                    <CheckableElement
                      onClick={handleUpdateTypes}
                      value={!!types.find(_type => _type === type)}
                      type={type}
                      key={type}
                    />
                  ))}
                </Stack>
                <Stack alignItems="flex-start" spacing="base">
                  {[FILTERABLE_TYPES[2], FILTERABLE_TYPES[3]].map(type => (
                    <CheckableElement
                      onClick={handleUpdateTypes}
                      value={!!types.find(_type => _type === type)}
                      type={type}
                      key={type}
                    />
                  ))}
                </Stack>
              </Flex>
            </Box>
          )}
        </Transition>
        {!hideBackdrop ? (
          <Fade timeout={250} in={!!showing}>
            {styles => (
              <Box
                onClick={handleClose}
                position="absolute"
                top="0"
                left={0}
                width="100%"
                height="calc(100% - 33px)"
                bg="rgba(0,0,0,0.5)"
                zIndex={99}
                style={styles}
              />
            )}
          </Fade>
        ) : null}
      </Flex>
    );
  }
);
