import React from 'react';
import { Box, BoxProps, color, Grid, GridProps } from '@stacks/ui';
import { border } from '@common/utils';
import { CodeIcon } from '@components/icons/code';
import { ContractCallIcon } from '@components/icons/contract-call';
import { StxInline } from '@components/icons/stx-inline';
import { WalletIcon } from '@components/icons/wallet';
import { AppsIcon } from '@components/icons/apps';
import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

export const getTxTypeIcon = (txType: Transaction['tx_type']): React.FC<BoxProps> => {
  let Icon = (p: any) => <StxInline {...p} strokeWidth={1.5} />;
  if (txType === 'smart_contract') {
    Icon = CodeIcon as any;
  } else if (txType === 'contract_call') {
    Icon = ContractCallIcon as any;
  }
  return Icon;
};

const ItemBox: React.FC<GridProps> = props => (
  <Grid
    placeItems="center"
    size="48px"
    borderRadius="8px"
    position="relative"
    border={border()}
    bg={color('bg')}
    color={color('invert')}
    boxShadow="low"
    as="span"
    {...props}
  />
);

const StatusBubble: React.FC<any> = ({ status }) => {
  const getStatusColor = () => {
    if (status === 'success') return color('feedback-success');
    if (status === 'pending') return color('feedback-alert');
    return color('feedback-error');
  };
  return (
    <Box
      top="4px"
      right="4px"
      position="absolute"
      bg={getStatusColor()}
      borderRadius="8px"
      size="8px"
      zIndex={9}
      as="span"
    />
  );
};

export const ItemIcon = React.memo(
  ({
    type,
    txType,
    opacity,
    status,
    ...rest
  }: {
    type: 'tx' | 'block' | 'principal';
    txType?: Transaction['tx_type'] | MempoolTransaction['tx_type'];
    status?: Transaction['tx_status'] | MempoolTransaction['tx_status'];
  } & GridProps) => {
    let Icon;
    if (txType) {
      Icon = getTxTypeIcon(txType);
    }
    if (type === 'block') {
      Icon = React.memo((p: any) => <AppsIcon {...p} size="22px" />);
    }
    if (type === 'principal') {
      Icon = React.memo((p: any) => <WalletIcon {...p} size="22px" />);
    }
    return (
      <ItemBox {...rest}>
        {status && status !== 'success' ? <StatusBubble status={status} /> : null}
        {Icon && (
          <Icon
            color={color('text-title')}
            position="relative"
            size={txType === 'token_transfer' ? '18px' : '21px'}
          />
        )}
      </ItemBox>
    );
  }
);
