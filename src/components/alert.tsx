import * as React from 'react';
import { Box, Flex, ExclamationMarkCircleIcon, CloseIcon } from '@blockstack/ui';
import { Title, Text, Pre } from '@components/typography';
import { useClearErrors } from '@common/hooks/use-clear-errors';
import { useSandboxState } from '@common/hooks/use-sandbox-state';

export const renderErrorMessage = ({
  reason,
  reason_data,
  txid,
}: {
  reason: 'FeeTooLow' | 'NotEnoughFunds' | 'NoSuchContract' | 'ContractAlreadyExists' | 'BadNonce';
  reason_data: any;
  txid?: string;
}) => {
  switch (reason) {
    case 'NoSuchContract':
      return (
        <>
          Contract not found. Please{' '}
          <Text
            as="a"
            color="var(--colors-accent)"
            _hover={{
              cursor: 'pointer',
            }}
            // @ts-ignore
            href="https://github.com/blockstack/explorer/issues/new"
            target="_blank"
          >
            file an issue
          </Text>{' '}
          for this. <Pre>{txid}</Pre>
        </>
      );
    case 'BadNonce':
      return 'There is a pending transaction, please wait until your previous transaction has completed.';
    case 'ContractAlreadyExists':
      return 'A contract with this name already exists at your address. Please change the contract name and try again.';
    case 'FeeTooLow':
      return `Fee was too low, expected ${reason_data?.expected} uSTX.`;
    case 'NotEnoughFunds':
      return `Not enough funds at address provided, expected ${BigInt(
        reason_data?.expected
      ).toString()} uSTX.`;
  }
};

export const Alert = ({ error: _error, clearError, showClearErrors, ...rest }: any) => {
  const clearErrors = useClearErrors();
  const { error } = useSandboxState();
  const hasError = error || _error;
  const formattedError = error
    ? {
        name: error?.name || 'Error',
        message: error?.message || error,
      }
    : {
        name: _error?.name || 'Error',
        message: _error?.message || _error,
      };
  return hasError ? (
    <Flex
      borderRadius="6px"
      border="1px solid var(--colors-border)"
      align="center"
      color="#F9A14D"
      {...rest}
    >
      <Flex
        borderRadius="6px 0 0 6px"
        bg="var(--colors-bg-alt)"
        py="tight"
        px="base"
        align="center"
        justify="center"
        flexGrow={1}
        borderRight="1px solid var(--colors-border)"
        alignSelf="stretch"
      >
        <Box mr="tight" color="red">
          <ExclamationMarkCircleIcon size="16px" />
        </Box>
        {error || _error ? (
          <Title
            fontSize="14px"
            as="h4"
            fontWeight={500}
            style={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
          >
            {formattedError.name}
          </Title>
        ) : null}
      </Flex>
      <Flex align="center" width="100%" py="tight" px="base-tight" pr="none">
        <Box>
          <Text fontSize="14px" pl="tight">
            {_error
              ? formattedError.message
              : error?.name === 'Status 429'
              ? 'Too many requests to the faucet, try again later.'
              : error?.message || renderErrorMessage(error)}
          </Text>
        </Box>
        {clearError || showClearErrors ? (
          <Box
            opacity={0.5}
            _hover={{
              cursor: 'pointer',
              opacity: 1,
            }}
            px="base"
            ml="auto"
            color="var(--colors-text-caption)"
            role="button"
            title="Clear error"
            aria-label="Clear error"
            onClick={() => {
              clearErrors();
              clearError && clearError();
            }}
          >
            <CloseIcon size="12px" />
          </Box>
        ) : null}
      </Flex>
    </Flex>
  ) : null;
};
