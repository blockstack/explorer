import React from 'react';
import { FlexProps } from '@stacks/ui';
import { FoundResult } from '@common/types/search-results';
import { transactionSingleState } from '@store/transactions';
import { transactionFromContractId } from '@store/contracts';
import { useAtomValue } from 'jotai/utils';
import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { TxLink } from '@components/links';
import { TxItem } from '@components/transaction-item';
import { ResultItemWrapper } from '@features/search/items/result-item-wrapper';

export const TxResultItem: React.FC<
  FlexProps & {
    handleFocus: any;
    handleBlur: any;
    isFocused?: boolean;
    isHovered?: boolean;
    isLast: boolean;
    result: FoundResult;
  }
> = ({ handleFocus, handleBlur, isFocused, isHovered, result, ...props }) => {
  const isTxid = result?.result.entity_type === 'tx_id';
  const isContractId = result?.result.entity_type === 'contract_address';
  if (!result || (!isTxid && !isContractId)) return null;
  const param = (result.result as any).entity_id;
  const anAtom = isTxid ? transactionSingleState(param) : transactionFromContractId(param);

  const transaction = useAtomValue<Transaction | MempoolTransaction | undefined>(anAtom);

  if (!transaction) return null;

  return (
    <TxLink txid={transaction.tx_id}>
      <ResultItemWrapper {...props} p={0}>
        <TxItem
          onFocus={handleFocus}
          onBlur={handleBlur}
          tabIndex="0"
          tx={transaction}
          isFocused={isFocused}
          isHovered={isHovered}
          minimal
          px="loose"
        />
      </ResultItemWrapper>
    </TxLink>
  );
};
