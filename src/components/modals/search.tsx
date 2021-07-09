import React from 'react';
import { Box, color, Flex, IconButton, Fade } from '@stacks/ui';
import { IconSearch, IconX } from '@tabler/icons';
import { Text, Title } from '@components/typography';
import { useModal } from '@common/hooks/use-modal';
import { MODALS } from '@common/constants';
import { useSearchComponent } from '@common/hooks/search/use-search-component';
import { SearchBox } from '@features/search/search-field/search-box';
import { SearchResultsCard } from '@features/search/dropdown/search-results-card';
import { useLockBodyScroll } from '@common/hooks/use-lock-body-scroll';
import { MetaverseBg } from '@components/metaverse-bg';
import { border } from '@common/utils';

export const SearchModal: React.FC = () => {
  const { modal, handleCloseModal } = useModal();
  const handleClose = () => {
    handleCloseModal();
  };
  const inputRef = React.useRef(null);
  const timeoutRef = React.useRef<number | null>(null);

  const { hasRecentItems, isLoading, handleClearResults } = useSearchComponent({
    variant: 'default',
    inputRef,
    timeoutRef,
  });

  const isOpen = modal === MODALS.SEARCH;

  const results = hasRecentItems;
  useLockBodyScroll(isOpen, true);
  return (
    <Fade in={isOpen}>
      {baseFadeInStyles => (
        <Flex
          style={baseFadeInStyles}
          flexDirection="column"
          position="fixed"
          top={0}
          left={0}
          minHeight="100vh"
          zIndex={99999999}
          width="100%"
          bg={color('bg')}
        >
          <Flex
            width="100vw"
            justifyContent="space-between"
            alignItems="center"
            p="base"
            position="relative"
            zIndex={99}
          >
            <Title color="white" fontSize={4}>
              Search
            </Title>
            <IconButton color="white" invert onClick={handleClose} icon={IconX} />
          </Flex>
          <Box px="base">
            <SearchBox inputRef={inputRef} timeoutRef={timeoutRef} />
          </Box>
          <Flex flexDirection="column" px="base" width="100%" position="relative" flexGrow={1}>
            <Fade in={results}>
              {styles => (
                <SearchResultsCard
                  handleItemOnClick={handleClose}
                  clearResults={handleClearResults}
                  isLoading={isLoading}
                  style={styles}
                  height="calc(100% - 32px)"
                  maxWidth="calc(100% - 32px)"
                  width="100%"
                />
              )}
            </Fade>

            <Fade in={!results}>
              {styles => (
                <Flex
                  flexDirection="column"
                  justifyContent="center"
                  p="extra-loose"
                  alignItems="center"
                  style={styles}
                  bg={color('bg')}
                  position="relative"
                  mt="base"
                  borderRadius="12px"
                  border={border()}
                  zIndex={99}
                  flexGrow={1}
                  mb="base"
                >
                  <Box
                    mb="extra-loose"
                    as={IconSearch}
                    color={color('invert')}
                    opacity={0.15}
                    size="128px"
                  />

                  <Text color={color('text-caption')} textAlign="center" lineHeight="28px">
                    Available search terms: principal, tx_id, contract_id, and block_hash.
                  </Text>
                </Flex>
              )}
            </Fade>
          </Flex>
          <MetaverseBg />
        </Flex>
      )}
    </Fade>
  );
};
