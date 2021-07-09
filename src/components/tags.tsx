import * as React from 'react';
import { color, FlexProps } from '@stacks/ui';

import { Badge } from '@components/badge';
import { getTxTypeName } from '@common/transaction-names';
import { getTxTypeIcon } from './transaction-item';
import { Transaction } from '@stacks/stacks-blockchain-api-types';
import { TransactionType } from '@common/constants';

export const transactionTypeColor = {
  [TransactionType.SMART_CONTRACT]: '#0F5257',
  [TransactionType.CONTRACT_CALL]: '#F9A14D',
  [TransactionType.TOKEN_TRANSFER]: 'blue',
  [TransactionType.COINBASE]: '#6014B8',
  [TransactionType.POISON_MICROBLOCK]: '#AAA9DD',
};

export interface TagProps extends FlexProps {
  type: Transaction['tx_type'];
  onClick?: any;
}

export const Tag = ({ type, ...rest }: TagProps) => {
  const Icon = getTxTypeIcon(type);
  return (
    <Badge
      labelProps={{ display: 'flex', alignItems: 'center' }}
      background={color('bg')}
      color={color('text-body')}
      {...rest}
    >
      <Icon
        mr="extra-tight"
        strokeWidth={1.5}
        width={type === 'token_transfer' ? '12px' : '16px'}
        height="auto"
        size={type === 'contract_call' ? '16px' : undefined}
        color="currentColor"
      />
      {getTxTypeName(type)}
    </Badge>
  );
};
