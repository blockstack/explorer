import React from 'react';
import { Box, Flex } from '@stacks/ui';
import { Title } from '@components/typography';
import { SearchComponent } from '@features/search/search';

export const HomePageTop: React.FC = React.memo(() => (
  <Flex
    width="100%"
    flexDirection="column"
    alignItems="center"
    maxWidth={['100%', '100%', 'calc(60% - 32px)']}
    justify="center"
  >
    <Title
      as="h1"
      fontSize="36px"
      display="block"
      width="100%"
      textAlign={['center', 'left']}
      mt="72px"
      mb="extra-loose"
      color="white"
    >
      Stacks Explorer
    </Title>
    <Box width="100%">
      <SearchComponent />
    </Box>
  </Flex>
));
