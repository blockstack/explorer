// @ts-nocheck
import React from 'react';
import { Box, Flex, Stack, color, Grid, transition } from '@stacks/ui';
import { Caption, Text, Title } from '@components/typography';
import { border } from '@common/utils';
import { useUser } from '@sandbox/hooks/use-user';
import { TxItem } from '@components/transaction-item';
import { useRouter } from 'next/router';

import {
  contractSearchQueryState,
  currentFunctionState,
  txContractState,
  txDetailsState,
} from '@sandbox/store/sandbox';
import { filterState } from '@store/recoil/filter';
import { IconButton } from '@components/icon-button';
import { ChevronDown } from '@components/icons/chevron-down';
import { Transaction } from '@stacks/stacks-blockchain-api-types';
import { useApiServer } from '@common/hooks/use-api';
import { Pending } from '@components/status';
import { Badge } from '@components/badge';
import { useCodeEditor } from '@sandbox/components/code-editor/code-editor';
import { useClarityRepl } from '@sandbox/hooks/use-clarity-repl';
import { ContractCallIcon } from '@components/icons/contract-call';
import { InfoCircleIcon } from '@components/icons/info-circle';
import { ExternalLinkIcon } from '@components/icons/external-link';
import { TxLink } from '@components/links';
import { FilteredMessage, FilterPanel } from '@components/filter-panel';

import { FilterIcon } from '@components/icons/filter';
import { functionCallViewState } from '@sandbox/store/views';
import { useRecoilState, useRecoilValue } from 'recoil';

const PanelHeader = React.memo(() => {
  const [filter, setFilterState] = useRecoilState(filterState('sandbox'));

  const handleFilterToggle = () => {
    setFilterState(state => ({ ...state, showing: !state.showing }));
  };
  return (
    <>
      <Flex
        justifyContent="space-between"
        px="base"
        borderBottom={border()}
        py="tight"
        bg={color('bg')}
      >
        <Caption>Transactions</Caption>

        <Caption
          display="flex"
          alignItems="center"
          _hover={{ cursor: 'pointer', color: color('text-title') }}
          onClick={handleFilterToggle}
        >
          <FilterIcon mr="extra-tight" color="currentColor" size="18px" strokeWidth={1.5} />
          Filter transactions
        </Caption>
      </Flex>
    </>
  );
});

const LoadButton = ({ codeBody }: { codeBody: string }) => {
  const router = useRouter();
  const [loaded, setLoaded] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);
  const [_, setCodeBody] = useCodeEditor();
  const { setResult } = useClarityRepl();

  return loaded ? (
    <Badge userSelect="none" border={border()} color={color('text-caption')}>
      Loaded!
    </Badge>
  ) : !clicked ? (
    <Badge
      userSelect="none"
      _hover={{ cursor: 'pointer', color: color('text-title') }}
      border={border()}
      color={color('text-caption')}
      onClick={() => setClicked(true)}
    >
      Load in editor
    </Badge>
  ) : (
    <Badge userSelect="none" border={border()} color={color('text-caption')}>
      <Flex>
        <Box
          _hover={{ cursor: 'pointer', color: color('text-title') }}
          pr="tight"
          onClick={() => setClicked(false)}
        >
          Cancel
        </Box>
        <Box
          _hover={{ cursor: 'pointer', color: color('text-title') }}
          pl="tight"
          borderLeft={border()}
          onClick={() => {
            setClicked(false);
            setCodeBody(codeBody);
            setLoaded(true);
            setResult(undefined);
            router.push('/sandbox/deploy');
            setTimeout(() => {
              setLoaded(false);
            }, 3000);
          }}
        >
          Confirm
        </Box>
      </Flex>
    </Badge>
  );
};

const TxDetailsFunctions = ({
  hasFunctionsAvailable,
  contractInterface,
  contractId,
  status,
}: any) => {
  const router = useRouter();
  const setView = useSetRecoilState(functionCallViewState);
  const setQuery = useSetRecoilState(contractSearchQueryState);
  const setCurrentFunction = useSetRecoilState(currentFunctionState);
  const [fnsVisible, setFnsVisibility] = React.useState(false);

  const handleSetFunction = (name: string) => {
    setView('function-overview');
    setQuery(contractId);
    setCurrentFunction(name);
    router.push('/sandbox/contract-call');
  };

  const handleSetContractQuery = () => {
    router.push('/sandbox/contract-call');
    setQuery(contractId);
    setCurrentFunction(undefined);
    setView('function-overview');
  };

  return hasFunctionsAvailable ? (
    <>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        borderBottom={fnsVisible ? border() : 'unset'}
        px="base"
        pb="tight"
        pt="base-tight"
      >
        <Caption fontWeight="500" color={color('text-body')}>
          Call contract
        </Caption>
        <Stack isInline spacing="tight" alignItems="center">
          <Badge
            userSelect="none"
            _hover={{
              cursor: 'pointer',
              color: color('text-title'),
            }}
            border={border()}
            color={color('text-caption')}
            onClick={handleSetContractQuery}
          >
            Load contract
          </Badge>
          <IconButton
            size="24px"
            iconProps={{
              size: '16px',
              strokeWidth: 2,
              transform: !fnsVisible ? 'none' : 'rotate(180deg)',
              transition,
            }}
            dark
            onClick={() => {
              setFnsVisibility(s => !s);
            }}
            icon={ChevronDown}
          />
        </Stack>
      </Flex>
      {fnsVisible ? (
        <Stack maxHeight="120px" overflowX="auto" spacing="0">
          {contractInterface?.abi?.functions?.map((func: any, index: number, arr: any[]) => {
            return func.access !== 'private' ? (
              <Flex
                borderBottom={index === arr.length - 1 ? 'unset' : border()}
                px="base"
                py="tight"
                alignItems="center"
                justifyContent="space-between"
              >
                <Flex alignItems="center" color={color('text-caption')}>
                  {func.access === 'read_only' ? (
                    <InfoCircleIcon size="18px" />
                  ) : (
                    <ContractCallIcon size="18px" />
                  )}
                  <Caption color={color('text-body')} ml="extra-tight">
                    {func.name}
                  </Caption>
                </Flex>
                {status === 'success' ? (
                  <Badge
                    _hover={{ color: color('text-title'), cursor: 'pointer' }}
                    color={color('text-caption')}
                    border={border()}
                    onClick={() => handleSetFunction(func.name)}
                  >
                    Load function
                  </Badge>
                ) : null}
              </Flex>
            ) : null;
          })}
        </Stack>
      ) : null}
    </>
  ) : null;
};

const TxDetails: React.FC<{
  status?: Transaction['tx_status'];
  type: Transaction['tx_type'];
  txId: Transaction['tx_id'];
  contractId: string;
}> = React.memo(({ contractId, txId, type, status }) => {
  const apiServer = useApiServer();
  const contractInterface = useRecoilValue(
    txContractState({
      apiServer,
      contractId,
    })
  );

  const hasFunctionsAvailable =
    type === 'smart_contract' && status === 'success' && contractInterface?.abi?.functions?.length;

  return (
    <>
      <Box>
        <Box>
          <Flex
            justifyContent="space-between"
            borderBottom={hasFunctionsAvailable ? border() : 'unset'}
            px="base"
            py="tight"
            alignItems="center"
          >
            <Caption fontWeight="500" color={color('text-body')}>
              Redeploy contract
            </Caption>
            <LoadButton codeBody={contractInterface.source_code} />
          </Flex>
          <TxDetailsFunctions
            contractId={contractId}
            status={status}
            hasFunctionsAvailable={hasFunctionsAvailable}
            contractInterface={contractInterface}
          />
          <TxLink txid={txId}>
            <Flex
              as="a"
              _hover={{
                bg: color('bg-alt'),
              }}
              borderTop={border()}
              px="base"
              py="base-tight"
              alignItems="center"
              target="_blank"
            >
              <Caption
                mr="tight"
                fontWeight="500"
                color={color('text-body')}
                transform="translateY(1px)"
              >
                View transaction
              </Caption>
              <ExternalLinkIcon color={color('text-caption')} size="18px" />
            </Flex>
          </TxLink>
        </Box>
      </Box>
    </>
  );
});

const SandboxTxItem = React.memo(
  ({ tx, isLast, ...rest }: { tx: Transaction; isLast?: boolean }) => {
    const { principal } = useUser();
    const [detailsVisibility, setDetailsVisibility] = useRecoilState(txDetailsState(tx.tx_id));
    const detailsVisible = detailsVisibility === 'visible';

    return (
      <Box px="loose" key={tx.tx_id} borderBottom={!isLast ? border() : undefined} {...rest}>
        <Flex alignItems="center" justifyContent="space-between">
          <TxItem
            width="unset"
            flexGrow={0}
            hideRightElements
            minimal
            principal={principal}
            tx={tx}
          />
          {tx.tx_type === 'token_transfer' && (
            <TxLink txid={tx.tx_id}>
              <IconButton as="a" target="_blank" flexShrink={0} dark icon={ExternalLinkIcon} />
            </TxLink>
          )}
          {tx.tx_type === 'smart_contract' || tx.tx_type === 'contract_call' ? (
            <IconButton
              color={color('text-caption')}
              _hover={{ bg: color('bg-alt') }}
              invert
              onClick={() => {
                if (detailsVisibility === 'hidden') {
                  setDetailsVisibility('visible');
                } else {
                  setDetailsVisibility('hidden');
                }
              }}
              iconProps={{
                size: '24px',
                transform: detailsVisible ? 'rotate(180deg)' : 'none',
                transition,
                stokeWidth: 2,
              }}
              icon={ChevronDown}
            />
          ) : null}
        </Flex>
        {detailsVisible && (tx.tx_type === 'smart_contract' || tx.tx_type === 'contract_call') ? (
          <Box pb="base">
            <Box boxShadow="mid" borderRadius={'12px'} border={border()} bg={color('bg')}>
              <React.Suspense
                fallback={
                  <Box p="base">
                    <Flex>
                      <Pending mr="base" size={'14px'} />
                      <Caption>Fetching contract interface</Caption>
                    </Flex>
                  </Box>
                }
              >
                <TxDetails
                  txId={tx.tx_id}
                  type={tx.tx_type}
                  status={tx.tx_status}
                  contractId={
                    tx.tx_type === 'smart_contract'
                      ? tx.smart_contract.contract_id
                      : tx.contract_call.contract_id
                  }
                />
              </React.Suspense>
            </Box>
          </Box>
        ) : null}
      </Box>
    );
  }
);

const TxList: React.FC = React.memo(() => {
  const filters = useRecoilValue(filterState('sandbox'));
  const { transactions, pendingTransactions, principal } = useUser({ suspense: true });

  const filteredTxs = transactions?.filter(tx => filters.types.find(type => type === tx.tx_type));
  const hasTxButIsFiltered = transactions?.length && filteredTxs?.length === 0;

  const pendingList = React.useMemo(
    () =>
      pendingTransactions?.map(tx => (
        <Flex borderBottom={border()} px="loose" alignItems="center" justifyContent="space-between">
          <TxItem
            hideRightElements
            minimal
            principal={principal}
            tx={tx}
            key={tx.tx_id}
            width="auto"
          />
          <TxLink txid={tx.tx_id}>
            <IconButton as="a" target="_blank" flexShrink={0} dark icon={ExternalLinkIcon} />
          </TxLink>
        </Flex>
      )),
    [pendingTransactions]
  );

  const txList = React.useMemo(
    () =>
      filteredTxs.map((tx, key, arr) =>
        tx.tx_status !== 'success' && !filters.showFailed ? null : (
          <SandboxTxItem key={key} tx={tx} key={tx.tx_id} isLast={key === arr.length - 1} />
        )
      ),
    [filteredTxs, filters.types, filters.showFailed, transactions]
  );

  return (
    <>
      {pendingTransactions?.length && filters.showPending ? pendingList : null}
      {filteredTxs?.length ? (
        txList
      ) : hasTxButIsFiltered ? (
        <FilteredMessage filterKey="sandbox" />
      ) : (
        <Flex flexGrow={1} flexDirection="column" alignItems="center" justifyContent="center">
          <Stack textAlign="center">
            <Title>No Transactions</Title>
            <Caption>Your list of transactions will display here.</Caption>
          </Stack>
        </Flex>
      )}
    </>
  );
});

const TxLoadingPanel = React.memo(() => (
  <Box p="extra-loose" flexGrow={1} width="100%">
    <Flex flexDirection="column" alignItems="center">
      <Grid placeItems="center" borderRadius="100%" size="64px" border={border()} boxShadow="mid">
        <Pending opacity={0.5} size="32px" />
      </Grid>
      <Text mt="base" fontWeight="500" fontSize="14px" color={color('text-caption')}>
        Fetching transactions...
      </Text>
    </Flex>
  </Box>
));

export const TransactionsPanel = React.memo(props => {
  return (
    <Flex
      position="relative"
      flexDirection="column"
      flexGrow={1}
      bg={color('bg-alt')}
      overflow="hidden"
      {...props}
    >
      <PanelHeader />
      <FilterPanel hideBackdrop showBorder bg={color('bg')} filterKey="sandbox" />

      <Flex
        flexDirection="column"
        flexGrow={1}
        maxHeight="900px"
        overflow="auto"
        bg={color('bg')}
        position="relative"
      >
        <React.Suspense fallback={<TxLoadingPanel />}>
          <TxList />
        </React.Suspense>
      </Flex>
    </Flex>
  );
});
