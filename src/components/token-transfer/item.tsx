// @ts-nocheck
// todo: remove
import * as React from 'react';
import { Ref } from 'react';
import {
  Box,
  Flex,
  Stack,
  FlexProps,
  BoxProps,
  Grid,
  GridProps,
  color,
  DynamicColorCircle,
} from '@stacks/ui';
import { Truncate } from '@components/truncated';
import { microToStacks, startPad, validateStacksAddress } from '@common/utils';
import { Text } from '@components/typography';
import {
  TransactionEvent,
  TransactionEventAssetType,
  TransactionEventSmartContractLog,
  TransactionEventNonFungibleAsset,
  TransactionEventFungibleAsset,
  TransactionEventStxAsset,
} from '@stacks/stacks-blockchain-api-types';
import { clarityValuetoHumanReadable } from '@common/utils';
import { Tooltip } from '@components/tooltip';
import { Caption } from '@components/typography';

import { truncateMiddle, getFungibleAssetName } from '@common/utils';
import { CodeAccordian } from '@components/code-accordian';

import { getAssetEventTypeLabel, getEventTypeName } from '@components/token-transfer/utils';
import { TokenTransferItemProps } from '@components/token-transfer/types';
import { LogIcon } from '@components/svg';
import { useActive, useHover } from 'use-events';
import { StxNexus } from '@components/icons/stx-nexus';

import { CodeIcon } from '@components/icons/code';
import { ChevronDown } from '@components/icons/chevron-down';
import { IconButton } from '@components/icon-button';
import { AddressLink } from '@components/links';
import { ExternalLinkIcon } from '@components/icons/external-link';

const Value = React.memo(
  React.forwardRef(({ children, ...rest }: any, ref: Ref<HTMLDivElement>) => (
    <Box>
      <Text style={{ whiteSpace: 'nowrap' }} ref={ref} {...rest} color="var(--colors-text-body)">
        {children}
      </Text>
    </Box>
  ))
);

export const ValueWrapped = React.memo(({ truncate, offset = 4, value, ...rest }: any) =>
  truncate ? (
    <Tooltip label={value}>
      <Value {...rest}>{truncateMiddle(value, offset)}</Value>
    </Tooltip>
  ) : (
    <Value {...rest}>{value}</Value>
  )
);

export const ItemIcon = React.memo(
  ({ name, type }: { name?: string; type: TransactionEvent['event_type'] }) => {
    switch (type) {
      case 'smart_contract_log':
        return (
          <Grid
            display={['none', 'none', 'grid']}
            bg={color('invert')}
            color={color('bg')}
            mr="tight"
            size="28px"
            placeItems="center"
            borderRadius="28px"
          >
            <CodeIcon strokeWidth="2" size="16px" />
          </Grid>
        );
      case 'fungible_token_asset':
        return name ? (
          <DynamicColorCircle
            display={['none', 'none', 'grid']}
            mr="tight"
            size="28px"
            string={name}
          >
            {name.split('::')[1][0]}
          </DynamicColorCircle>
        ) : null;

      case 'non_fungible_token_asset':
        return name ? (
          <DynamicColorCircle
            display={['none', 'none', 'grid']}
            mr="tight"
            size="28px"
            string={name}
          >
            {name.split('::')[1][0]}
          </DynamicColorCircle>
        ) : null;

      default:
        return (
          <Grid
            display={['none', 'none', 'grid']}
            bg={color('invert')}
            color={color('bg')}
            mr="tight"
            size="28px"
            placeItems="center"
            borderRadius="28px"
          >
            <StxNexus color="currentColor" size="14px" />
          </Grid>
        );
    }
  }
);

const EventAsset = React.memo(
  ({ event, length = 0, ...rest }: { event: TransactionEvent; length?: number } & FlexProps) =>
    event ? (
      <Flex
        pl={['base', 'base', 'unset']}
        alignItems="center"
        pr="base"
        width={'25%'}
        flexShrink={0}
        {...rest}
      >
        <Flex
          display={['none', 'none', 'flex']}
          alignItems="center"
          justifyContent="center"
          width="48px"
        >
          <Caption fontSize="14px">
            {startPad(event.event_index + 1, length?.toString().length + 1)}
          </Caption>
        </Flex>
        <ItemIcon
          name={
            event.event_type !== 'smart_contract_log' && 'asset' in event && event.asset
              ? (event.asset.asset_id as string)
              : undefined
          }
          type={event.event_type}
        />
        {event.event_type !== 'smart_contract_log' &&
        'asset' in event &&
        event.asset &&
        event.asset.asset_id ? (
          <Text fontSize="14px" fontWeight="500" color="var(--colors-text-title)">
            {getFungibleAssetName(event.asset.asset_id)}
          </Text>
        ) : (
          <Text fontSize="14px" fontWeight="500" color="var(--colors-text-title)">
            {getEventTypeName(event.event_type)}
          </Text>
        )}
      </Flex>
    ) : null
);

const ContractLogItem = React.memo(
  ({ event, ...rest }: { event: TransactionEventSmartContractLog }) => {
    const value = clarityValuetoHumanReadable(event.contract_log.value);
    const isAddress = value && validateStacksAddress(value);
    return (
      <Text
        color={color('text-body')}
        style={{ wordBreak: 'break-word' }}
        fontWeight="500"
        {...rest}
      >
        {isAddress ? <Truncate>{value}</Truncate> : value}
      </Text>
    );
  }
);

const NonFungibleItem = React.memo(
  ({ event, ...rest }: { event: TransactionEventNonFungibleAsset }) => {
    const value = clarityValuetoHumanReadable(event.asset.value);
    return (
      <Box {...rest}>
        <Text color={color('text-body')} fontWeight="500">
          {value} <Text display="inline">NFT</Text>
        </Text>
      </Box>
    );
  }
);
const FungibleItem = React.memo(({ event, ...rest }: { event: TransactionEventFungibleAsset }) => (
  <Box {...rest}>
    <Text color={color('text-body')} fontWeight="500">
      {event.asset.amount} <Text display="inline">FT</Text>
    </Text>
  </Box>
));

const StxAsset = React.memo(({ event, ...rest }: { event: TransactionEventStxAsset }) => {
  if (!event.asset.amount) return null;
  return (
    <Box {...rest}>
      <Text color={color('text-body')}>{microToStacks(event.asset.amount)} STX</Text>
    </Box>
  );
});

export const EventAssetValue = React.memo(
  // @ts-ignore
  ({ event, ...rest }: { event: TransactionEvent } & BoxProps) => {
    if (!event) return null;
    switch (event.event_type) {
      case 'fungible_token_asset':
        return <FungibleItem event={event} {...rest} />;
      case 'non_fungible_token_asset':
        return <NonFungibleItem event={event} {...rest} />;
      case 'smart_contract_log':
        return <ContractLogItem event={event} {...rest} />;
      case 'stx_asset':
        return <StxAsset event={event} {...rest} />;
    }
  }
);

const IconWrapper: React.FC<GridProps> = props => {
  return (
    <Grid
      placeItems={'center'}
      borderRadius={'4px'}
      overflow={'hidden'}
      bg={color('text-caption')}
      mr="tight"
      color="white"
      size="20px"
      {...props}
    />
  );
};

export const EventAssetType = React.memo(
  ({ event, ...rest }: { event: TransactionEvent } & FlexProps) => {
    if (event.event_type === 'smart_contract_log') {
      return (
        <Flex alignItems="center" {...rest}>
          <IconWrapper mr="tight" size={'24px'} bg="transparent">
            <LogIcon size={'24px'} color={color('text-caption')} />
          </IconWrapper>
          <Text color={color('text-body')} fontWeight="500">
            Log
          </Text>
        </Flex>
      );
    }
    if ('asset' in event && event.asset && event.asset.asset_event_type) {
      const {
        label,
        icon: Icon,
        ...props
      } = getAssetEventTypeLabel(event.asset.asset_event_type as TransactionEventAssetType);
      return (
        <Flex alignItems="center" {...rest}>
          {Icon && (
            <IconWrapper bg="transparent" size="24px" mr="tight">
              <Icon color={props.bg} size="24px" strokeWidth={2} />
            </IconWrapper>
          )}
          <Text color={color('text-body')} fontWeight="500">
            {label}
          </Text>
        </Flex>
      );
    }
    return null;
  }
);

export const TokenTransferItem = React.memo(
  ({ data, noBottomBorder, length = 0, ...flexProps }: TokenTransferItemProps) => {
    const [isOpen, openCode] = React.useState(false);
    const [hover, bind] = useHover();
    const [active, activeBind] = useActive();
    const handleOpen = React.useCallback(() => {
      openCode(!isOpen);
    }, [isOpen]);
    return (
      <Box bg={color('bg')} fontSize="14px" {...activeBind}>
        <Stack
          isInline
          borderBottom={noBottomBorder ? 'unset' : '1px solid'}
          borderColor="var(--colors-border)"
          py="loose"
          pr="base"
          {...bind}
          {...flexProps}
        >
          <EventAsset length={length} event={data} />
          <Stack alignItems="center" isInline width="75%" flexShrink={0} flexGrow={1}>
            <EventAssetType width="calc(33.333% - 44px)" event={data} />
            <EventAssetValue width="calc(33.333% + 16px)" event={data} />
            <Flex justifyItems="flex-start" flexGrow={1}>
              {'asset' in data && data?.asset?.recipient ? (
                <AddressLink principal={data?.asset?.recipient}>
                  <Text
                    display="flex"
                    alignItems="center"
                    _hover={{
                      textDecoration: 'underline',
                    }}
                    target="_blank"
                    as="a"
                    color={color('text-body')}
                  >
                    {truncateMiddle(data?.asset?.recipient)}
                    <ExternalLinkIcon size="16px" color={color('text-caption')} ml="tight" />
                  </Text>
                </AddressLink>
              ) : null}
            </Flex>
            <IconButton dark icon={ChevronDown} onClick={handleOpen as any} />
          </Stack>
        </Stack>
        <CodeAccordian
          borderTop={noBottomBorder ? '1px solid var(--colors-border)' : 'unset'}
          borderBottom={isOpen && !noBottomBorder ? '1px solid' : 'unset'}
          isLast={noBottomBorder}
          code={data}
          isOpen={isOpen}
        />
      </Box>
    );
  }
);
