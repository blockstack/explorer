import * as React from 'react';
import {
  Box,
  DynamicColorCircle,
  ChevronIcon,
  Stack,
  Flex,
  Grid,
  FlexProps,
  color,
} from '@stacks/ui';
import { CodeAccordian } from '@components/code-accordian';

import pluralize from 'pluralize';
import { Caption, Text, Pre, Title } from '@components/typography';
import { Row } from '@components/rows/row';
import {
  PostCondition,
  PostConditionFungible,
  PostConditionFungibleConditionCode,
  PostConditionNonFungible,
  PostConditionNonFungibleConditionCode,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';
import { useHover } from 'use-events';
import { ValueWrapped } from '@components/token-transfer/item';
import NextLink from 'next/link';
import { InfoIcon } from '@components/icons/info';
import { border, capitalize, truncateMiddle, validateStacksAddress } from '@common/utils';
import { Section } from '@components/section';
import { Circle } from '@components/circle';
import { StxInline } from '@components/icons/stx-inline';
import { getTicker } from '@components/tx-events';
import { Badge } from '@components/badge';
import { microStxToStx } from '@stacks/ui-utils';

const getConditionType = (type: PostCondition['type']) => {
  switch (type) {
    case 'fungible':
      return 'FT';
    case 'non_fungible':
      return 'NFT';
    case 'stx':
      return 'STX';
  }
};

const _Condition = ({
  condition,
  index: key,
  length,
}: {
  condition: PostCondition;
  index: number;
  length: number;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const isLast = key === length - 1;

  const handleOpen = React.useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isOpen]);
  const [hover, bind] = useHover();

  const note = (
    <Flex
      bg="var(--colors-bg)"
      color="var(--colors-text-caption)"
      p="base"
      borderBottom={!isLast ? '1px solid var(--colors-border)' : undefined}
      borderTop="1px solid var(--colors-border)"
      alignItems="center"
      borderBottomRightRadius={isLast ? '12px' : 'unset'}
      borderBottomLeftRadius={isLast ? '12px' : 'unset'}
      as="a"
      href="https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-005-blocks-and-transactions.md#transaction-post-conditions"
      target="_blank"
      _hover={{
        bg: 'var(--colors-bg-light)',
        color: 'var(--colors-accent)',
      }}
    >
      <InfoIcon mr="tight" size="18px" />
      <Caption color="currentColor">Click here to learn more about post conditions.</Caption>
    </Flex>
  );
  return (
    <React.Fragment key={key}>
      <Row
        borderBottom={isLast && !isOpen ? 'unset' : '1px solid var(--colors-border)'}
        pl="base"
        onClick={handleOpen}
        _hover={{
          cursor: 'pointer',
        }}
        {...bind}
      >
        <Stack width="100%" isInline>
          <Flex pr="base" alignItems="center" width="calc(33.333%)" flexShrink={0}>
            <Pre>{condition.condition_code}</Pre>
          </Flex>
          {'address' in condition.principal ? (
            <Flex alignItems="center" width="calc(33.333%)" flexShrink={0}>
              <NextLink
                href="/address/[principal]"
                as={`/address/${condition.principal.address}`}
                passHref
              >
                <Text _hover={{ textDecoration: 'underline' }} as="a">
                  <ValueWrapped offset={8} truncate value={condition.principal.address} />
                </Text>
              </NextLink>
            </Flex>
          ) : null}
          <Flex alignItems="center" width="calc(33.333% - 38px)" flexShrink={0}>
            <Text>
              {condition.type === 'stx' ? condition.amount + ' ' : null}
              {getConditionType(condition.type)}
            </Text>
          </Flex>
          <Flex
            alignItems="center"
            justify="center"
            width="48px"
            flexShrink={0}
            color="var(--colors-invert)"
            opacity={hover ? 1 : 0.5}
          >
            <ChevronIcon size="32px" direction={isOpen ? 'up' : 'down'} />
          </Flex>
        </Stack>
      </Row>
      <CodeAccordian isLast={isLast} code={condition} isOpen={isOpen} note={note} />
    </React.Fragment>
  );
};

const constructPostConditionAssetId = (
  asset: PostConditionFungible['asset'] | PostConditionNonFungible['asset']
) => {
  return `${asset.contract_address}.${asset.contract_name}::${asset.asset_name}`;
};

const getFirstLetterOfAsset = (value: string) => {
  if (value.includes('::')) {
    return value.split('::')[1][0];
  } else {
    if (value.includes('.')) {
      const parts = value.split('.');
      if (validateStacksAddress(parts[0])) {
        return value[1][0];
      } else {
        return value[0][0];
      }
    }
    return value[0];
  }
};

const getPrettyCode = (
  code: PostConditionFungibleConditionCode | PostConditionNonFungibleConditionCode,
  plural: boolean
) => {
  const singular = 'transfer';
  const modifier = pluralize(singular, plural ? 2 : 1);
  switch (code) {
    case 'not_sent':
      return `prevent ${singular}`;
    case 'sent':
      return modifier;
    case 'sent_equal_to':
      return `${modifier} exactly`;
    case 'sent_greater_than':
      return `${modifier} more than`;
    case 'sent_greater_than_or_equal_to':
      return `${modifier} at least`;
    case 'sent_less_than':
      return `${modifier} less than`;
    case 'sent_less_than_or_equal_to':
      return `${modifier} no more than`;
  }
};

const ConditionAsset = ({ condition }: { condition: PostCondition }) => {
  switch (condition.type) {
    case 'fungible':
    case 'non_fungible':
      const assetId = constructPostConditionAssetId(condition.asset);
      const letter = getFirstLetterOfAsset(assetId);
      return <DynamicColorCircle string={assetId}>{letter}</DynamicColorCircle>;
    case 'stx':
      return (
        <Circle size="48px" bg={color('accent')}>
          <StxInline size="20px" color="white" />
        </Circle>
      );
  }
};

const getConditionTicker = (condition: PostCondition) => {
  switch (condition.type) {
    case 'stx':
      return 'STX';
    case 'fungible':
      return getTicker(condition.asset.asset_name).toUpperCase();
    default:
      return '';
  }
};

const getAmount = (condition: PostCondition) => {
  if (condition.type === 'stx') {
    return microStxToStx(condition.amount);
  }

  if (condition.type === 'fungible') {
    return parseFloat(condition.amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  }
  return `1 ${condition.asset_value.repr}`;
};

const getAddressValue = (condition: PostCondition) => {
  switch (condition.principal.type_id) {
    case 'principal_standard':
      return condition.principal.address;
    case 'principal_origin':
      return 'self';
    case 'principal_contract':
      return `${condition.principal.address}.${condition.principal.contract_name}`;
  }
};

const Condition = ({ condition, isLast }: { condition: PostCondition; isLast?: boolean }) => {
  return (
    <Flex alignItems="center" borderBottom={!isLast ? border() : 'unset'} py="base">
      <ConditionAsset condition={condition} />
      <Stack spacing="tight" flexGrow={1} ml="base">
        <Caption>{truncateMiddle(getAddressValue(condition), 8)}</Caption>

        <Title fontSize={1}>
          {capitalize(getPrettyCode(condition.condition_code, true))} {getAmount(condition)}{' '}
          {getConditionTicker(condition)}
        </Title>
      </Stack>
    </Flex>
  );
};
export const PostConditions: React.FC<
  {
    failed?: boolean;
    conditions?: PostCondition[];
    mode?: Transaction['post_condition_mode'];
  } & FlexProps
> = ({ conditions, mode, failed, ...rest }) => (
  <Section
    title="Post conditions"
    topRight={
      mode
        ? () => (
            <Badge color={color('text-body')} bg={color('bg-alt')}>
              {capitalize(mode)} mode
            </Badge>
          )
        : undefined
    }
    {...rest}
  >
    <Box px="loose">
      {conditions?.length ? (
        <>
          {conditions.map((condition: PostCondition, key) => (
            <Condition isLast={key === conditions.length - 1} condition={condition} key={key} />
          ))}
        </>
      ) : (
        <Grid placeItems="center" px="base" py="extra-loose">
          <Caption my="0" p="0" fontSize="14px">
            This transaction has no post-conditions.
          </Caption>
        </Grid>
      )}
    </Box>
  </Section>
);
