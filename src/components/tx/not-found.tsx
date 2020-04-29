import React from 'react';

import { Text } from '@blockstack/ui';

export const TxNotFound = () => (
  <>
    <Text textStyle="display.large" fontSize="36px" color="var(--colors-text-title)">
      Transaction details
    </Text>
    <Text display="block" mt="base" color="var(--colors-text-body)">
      There is no record of a transaction with this hash.
    </Text>
  </>
);

export default TxNotFound;
