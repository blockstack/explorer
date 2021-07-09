import React from 'react';
import { TransactionEvent, TransactionEventAssetType } from '@stacks/stacks-blockchain-api-types';
import { Section } from '@components/section';
import { Box, Grid, Flex, color, Stack, FlexProps, DynamicColorCircle } from '@stacks/ui';
import { IconAlignLeft, IconArrowRight, IconPlus, IconTrash } from '@tabler/icons';
import { StxInline } from '@components/icons/stx-inline';
import {
  addSepBetweenStrings,
  border,
  capitalize,
  getAssetNameParts,
  microToStacks,
  truncateMiddle,
} from '@common/utils';
import { Caption, Link, Title } from '@components/typography';
import { Circle } from '@components/circle';
import { SenderRecipient } from '@components/addresses';
import { AddressLink } from '@components/links';

export const getTicker = (name: string) => {
  if (name.includes('-')) {
    const parts = name.split('-');
    if (parts.length >= 3) {
      return `${parts[0][0]}${parts[1][0]}${parts[2][0]}`;
    } else {
      return `${parts[0][0]}${parts[1][0]}${parts[1][1]}`;
    }
  } else {
    if (name.length >= 3) {
      return `${name[0]}${name[1]}${name[2]}`;
    }
    return name;
  }
};

const getIcon = (type: TransactionEventAssetType) => {
  switch (type) {
    case 'burn':
      return IconTrash;
    case 'mint':
      return IconPlus;
    case 'transfer':
      return IconArrowRight;
  }
};

const AssetEventTypeBubble = ({ type }: { type?: TransactionEventAssetType }) => {
  if (!type) return null;
  const Icon = getIcon(type);
  return (
    <Circle
      zIndex={99}
      size="20px"
      bg={color('bg')}
      border={border()}
      position="absolute"
      top={'-4px'}
      right="-2px"
      color={color('accent')}
    >
      <Icon size="14px" color="currentColor" />
    </Circle>
  );
};

export const ItemIcon = React.memo(({ event }: { event: TransactionEvent }) => {
  const type = event.event_type;

  const name =
    event.event_type === 'fungible_token_asset' ||
    event.event_type === 'non_fungible_token_asset' ||
    event.event_type === 'stx_asset'
      ? event.asset.asset_id
      : undefined;

  const assetEventType =
    event.event_type === 'fungible_token_asset' ||
    event.event_type === 'non_fungible_token_asset' ||
    event.event_type === 'stx_asset'
      ? (event.asset.asset_event_type as TransactionEventAssetType)
      : undefined;

  switch (type) {
    case 'smart_contract_log':
      return (
        <Grid
          bg={color('bg')}
          border={border()}
          color={color('text-body')}
          size="48px"
          placeItems="center"
          borderRadius="12px"
          boxShadow="mid"
          flexShrink={0}
        >
          <IconAlignLeft strokeWidth="2" size="16px" />
        </Grid>
      );
    case 'fungible_token_asset':
      return name ? (
        <DynamicColorCircle
          flexShrink={0}
          textTransform="uppercase"
          size="48px"
          string={name}
          position="relative"
        >
          {assetEventType ? <AssetEventTypeBubble type={assetEventType} /> : null}
          {getAssetNameParts(name).asset[0]}
        </DynamicColorCircle>
      ) : null;

    case 'non_fungible_token_asset':
      return name ? (
        <DynamicColorCircle flexShrink={0} textTransform="uppercase" size="48px" string={name}>
          {assetEventType ? <AssetEventTypeBubble type={assetEventType} /> : null}
          {getAssetNameParts(name).asset[0]}
        </DynamicColorCircle>
      ) : null;

    default:
      return (
        <Grid
          flexShrink={0}
          bg={color('accent')}
          color={color('bg')}
          mr="tight"
          size="48px"
          placeItems="center"
          borderRadius="48px"
        >
          <StxInline color="currentColor" size="22px" />
        </Grid>
      );
  }
});

const getAssetAmounts = (event: TransactionEvent) => {
  switch (event.event_type) {
    case 'fungible_token_asset':
      return parseFloat(event.asset.amount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      });
    case 'non_fungible_token_asset':
      return parseInt(event.asset.value.repr.replace('u', '')).toLocaleString();
    case 'stx_asset':
      return event.asset.amount ? `${microToStacks(event.asset.amount)} STX` : undefined;
  }
};

const getAssetEventType = (event: TransactionEvent) => {
  switch (event.event_type) {
    case 'smart_contract_log':
      return addSepBetweenStrings([`Contract log`, capitalize(event.contract_log.topic)]);
    case 'stx_lock':
      return 'STX lock';
    default:
      return 'asset' in event && event.asset && event.asset.asset_event_type
        ? capitalize(event.asset.asset_event_type)
        : undefined;
  }
};

const getParticipants = (event: TransactionEvent) => {
  if ('asset' in event && event.asset) {
    switch (event.asset.asset_event_type) {
      case 'transfer': {
        return (
          <SenderRecipient
            sender={event.asset.sender as string}
            recipient={event.asset.recipient as string}
          />
        );
      }
      case 'mint':
        return event.asset.recipient ? (
          <Caption>
            <AddressLink principal={event.asset.recipient}>
              <Link as="a">{truncateMiddle(event.asset.recipient)}</Link>
            </AddressLink>
          </Caption>
        ) : null;
    }
  } else if ('stx_lock_event' in event && event.stx_lock_event) {
    return (
      <Caption>
        <AddressLink principal={event.stx_lock_event.locked_address}>
          <Link as="a">{truncateMiddle(event.stx_lock_event.locked_address)}</Link>
        </AddressLink>
      </Caption>
    );
  }
};

// handle if the print is a hex, convert it to string if so
function handleContractLogHex(repr: string) {
  if (repr?.startsWith('0x')) {
    try {
      return Buffer.from(repr.replace('0x', ''), 'hex').toString('utf8');
    } catch (e) {
      return repr;
    }
  }
  return repr;
}

const getName = (event: TransactionEvent) => {
  const assetId =
    event.event_type === 'fungible_token_asset' || event.event_type === 'non_fungible_token_asset'
      ? event.asset.asset_id
      : undefined;
  switch (event.event_type) {
    case 'stx_lock':
      return `${microToStacks(event.stx_lock_event.locked_amount)} STX`;
    case 'smart_contract_log':
      return handleContractLogHex(event.contract_log.value.repr);
    case 'stx_asset':
      return event.asset?.value ? `${microToStacks(event.asset?.value)} STX` : 'STX transfer';
    default:
      return assetId ? getAssetNameParts(assetId).asset : undefined;
  }
};

const Item: React.FC<{ event: TransactionEvent; isLast?: boolean }> = ({ event, isLast }) => {
  const name = getName(event);
  const assetEventType = getAssetEventType(event);
  const assetAmounts = getAssetAmounts(event);
  const participants = getParticipants(event);

  const assetId =
    event.event_type === 'fungible_token_asset' || event.event_type === 'non_fungible_token_asset'
      ? event.asset.asset_id
      : undefined;

  const tokenType =
    event.event_type === 'fungible_token_asset'
      ? 'Fungible token'
      : event.event_type === 'non_fungible_token_asset'
      ? 'Non-fungible token'
      : undefined;

  return (
    <Flex
      borderBottom={!isLast ? border() : undefined}
      justifyContent="space-between"
      alignItems="center"
      py="loose"
    >
      <Flex alignItems="center">
        <ItemIcon event={event} />
        <Stack ml="base" spacing="tight">
          <Title lineHeight="28px">{name}</Title>
          <Stack
            flexWrap="wrap"
            alignItems="center"
            spacing="extra-tight"
            isInline
            divider={<Caption>∙</Caption>}
          >
            {assetEventType ? <Caption fontWeight="bold">{assetEventType}</Caption> : null}
            {assetAmounts && (
              <Caption>
                {assetAmounts}{' '}
                {assetId && getTicker(getAssetNameParts(assetId).asset).toUpperCase()}
              </Caption>
            )}
            {participants && participants}
            {tokenType && <Caption>{tokenType}</Caption>}
          </Stack>
        </Stack>
      </Flex>
      <Caption>{event.event_index}</Caption>
    </Flex>
  );
};

const EventsList = ({ events }: { txId: string; events: TransactionEvent[] }) => {
  // TODO: paginated data
  return (
    <Box px="loose">
      {events.map((event, index, arr) => (
        <Item key={index} event={event} isLast={index === arr.length - 1} />
      ))}
    </Box>
  );
};
export const Events = ({
  events,
  txId,
  ...rest
}: {
  txId: string;
  events: TransactionEvent[];
} & FlexProps) => {
  return events?.length ? (
    <Section title="Events" {...rest}>
      <EventsList events={events} txId={txId} />
    </Section>
  ) : null;
};
