import * as React from 'react';

import { Box, color, Flex, Stack, Text } from '@stacks/ui';
import { getMemoString, microToStacks } from '@common/utils';

import { Badge } from '@components/badge';
import { Link } from '@components/typography';
import NextLink from 'next/link';
import { Rows } from '@components/rows';
import { Timestamp } from '@components/timestamp';
import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { Section } from '@components/section';
import { BlockLink, TxLink } from '@components/links';
import { IconButton } from '@components/icon-button';
import QuestionMarkCircleOutlineIcon from 'mdi-react/QuestionMarkCircleOutlineIcon';
import { StxInline } from '@components/icons/stx-inline';
import { Circle } from '@components/circle';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons';

interface FeeComponentProps {
  fees: string;
  sponsored: boolean;
}

const FeesComponent = React.memo(({ fees, sponsored }: FeeComponentProps) => (
  <>
    <Box>
      <Text>{microToStacks(fees)} STX</Text>
    </Box>
    {sponsored ? (
      <Badge ml="base" bg="ink.300">
        Sponsored
      </Badge>
    ) : null}
  </>
));

const BlockComponent = React.memo(({ block, ts }: { block: number | string; ts: number }) => {
  return (
    <>
      {/**
       * TODO: link to block
       */}
      <Box>#{block}</Box>
      {/* MICROBLOCK TODO: Make this real data if possible? */}
      {/* <Box ml="extra-tight">(6 confirmations)</Box> */}
      <Box ml="base">
        <Timestamp ts={ts} />
      </Box>
    </>
  );
});

const AddressComponent = React.memo(({ principal }: { principal: string }) => {
  return (
    <NextLink href={`/address/[principal]`} as={`/address/${principal}`} passHref>
      <Link as="a">{principal}</Link>
    </NextLink>
  );
});

const NoncesComponent = React.memo(({ nonce }: { nonce: number }) => {
  return <Text display="block">{nonce}</Text>;
});

const getSenderName = (txType: Transaction['tx_type']) => {
  switch (txType) {
    case 'smart_contract':
      return 'Deployed by';
    case 'contract_call':
      return 'Called by';
    default:
      return 'Sender address';
  }
};

const transformDataToRowData = (d: Transaction | MempoolTransaction) => {
  const txid = {
    label: {
      children: 'Transaction ID',
    },
    children: d.tx_id,
    copy: d.tx_id,
  };
  const canonical = {
    condition: d.tx_status !== 'pending' && 'canonical' in d && !d.canonical,
    label: {
      children: 'Non-canonical',
    },
    children: (
      <Flex alignItems="center">
        <Box>This transaction is contained in a non-canonical fork of the Stacks chain.</Box>
        <IconButton
          ml="tight"
          icon={QuestionMarkCircleOutlineIcon}
          dark
          as="a"
          href="https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-001-burn-election.md#committing-to-a-chain-tip"
          target="_blank"
        />
      </Flex>
    ),
  };
  const contractName =
    d.tx_type === 'contract_call'
      ? {
          condition: d.tx_type === 'contract_call',
          label: {
            children: 'Contract',
          },
          children:
            d.tx_type === 'contract_call' ? (
              <TxLink txid={d.contract_call.contract_id}>
                <Link as="a">{d.contract_call.contract_id}</Link>
              </TxLink>
            ) : (
              ''
            ),
          copy: d.tx_type === 'contract_call' ? d.contract_call.contract_id : '',
        }
      : {
          condition: d.tx_type === 'smart_contract',
          label: {
            children: 'Contract name',
          },
          children: d.tx_type === 'smart_contract' ? d.smart_contract.contract_id : '',
          copy: d.tx_type === 'smart_contract' ? d.smart_contract.contract_id : '',
        };
  const sender = {
    condition: typeof d.sender_address !== 'undefined',
    label: {
      children: getSenderName(d.tx_type),
    },
    children: <AddressComponent principal={d.sender_address} />,
    copy: d.sender_address,
  };
  const nonce = {
    label: {
      children: `Nonce`,
    },
    children: <NoncesComponent nonce={d.nonce} />,
    copy: d.nonce,
  };
  const fees = {
    label: {
      children: 'Fees',
    },
    children: <FeesComponent fees={d.fee_rate} sponsored={d.sponsored} />,
  };
  const blockTime = {
    condition: 'block_height' in d && typeof d.block_height !== 'undefined',
    label: {
      children: 'Block height',
    },
    children:
      'block_height' in d ? <BlockComponent block={d.block_height} ts={d.burn_block_time} /> : null,
  };
  const blockHash = {
    condition: 'block_hash' in d && typeof d.block_hash !== 'undefined',
    label: {
      children: 'Block hash',
    },
    children: 'block_hash' in d && (
      <BlockLink hash={d.block_hash}>
        <Link>{d.block_hash}</Link>
      </BlockLink>
    ),
    copy: 'block_hash' in d && d.block_hash,
  };

  switch (d.tx_type) {
    case 'token_transfer': {
      const amount = {
        label: 'Amount',
        children: (
          <Stack alignItems="center" isInline spacing="tight">
            <Box width="24px" position="relative">
              <Circle position="absolute" left={0} size="24px" bg={color('accent')} top="-12px">
                <StxInline strokeWidth={2} size="14px" color="white" />
              </Circle>
            </Box>
            <Text fontSize="16px" color={color('text-title')} fontWeight="500">
              {microToStacks(d.token_transfer.amount)}{' '}
              <Text as="span" display="inline" opacity="0.5">
                STX
              </Text>
            </Text>
          </Stack>
        ),
      };
      const tokenTransferSender = {
        condition: typeof d.sender_address !== 'undefined',
        label: {
          children: getSenderName(d.tx_type),
        },
        children: (
          <Stack isInline>
            <Box color={color('text-caption')}>
              <IconArrowUpRight size="16px" />
            </Box>
            <AddressComponent principal={d.sender_address} />
          </Stack>
        ),
        copy: d.sender_address,
      };
      const recipient = {
        label: {
          children: 'Recipient',
        },
        children: (
          <Stack isInline>
            <Box color={color('text-caption')}>
              <IconArrowDownRight size="16px" />
            </Box>
            <AddressComponent principal={d.token_transfer.recipient_address} />
          </Stack>
        ),
        copy: d.token_transfer.recipient_address,
      };

      const memo = {
        condition: !!getMemoString(d.token_transfer.memo),
        label: { children: 'Memo' },
        children: getMemoString(d.token_transfer.memo),
      };

      return [
        amount,
        tokenTransferSender,
        recipient,
        txid,
        fees,
        nonce,
        blockTime,
        blockHash,
        memo,
        canonical,
      ];
    }
    case 'coinbase': {
      const scratch = {
        condition:
          d.coinbase_payload.data !==
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        label: {
          children: 'Scratch space',
        },
        children: d.coinbase_payload.data,
      };
      return [txid, sender, fees, nonce, blockTime, blockHash, scratch, canonical];
    }
    default:
      return [contractName, txid, sender, fees, nonce, blockTime, blockHash, canonical];
  }
};

interface TransactionDetailsProps {
  transaction: Transaction | MempoolTransaction;
  hideContract?: boolean;
  contractName?: string;
  contractMeta?: string;
}

export const getContractId = (transaction: Transaction | MempoolTransaction) => {
  switch (transaction.tx_type) {
    case 'contract_call':
      return transaction.contract_call.contract_id;
    case 'smart_contract':
      return transaction.smart_contract.contract_id;
    default:
      return undefined;
  }
};

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transaction,
  hideContract,
  contractMeta,
  contractName,
  ...rest
}) => {
  return (
    <Section title="Summary" {...rest}>
      <Flex px="base" width="100%" flexDirection={['column', 'column', 'row']}>
        <Box width={['100%']}>
          <Rows noTopBorder items={transformDataToRowData(transaction) as any} />
        </Box>
      </Flex>
    </Section>
  );
};
