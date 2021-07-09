import * as React from 'react';
import { useNetworkMode } from '@common/hooks/use-network-mode';
import { Section } from '@components/section';
import { Box, color, Flex } from '@stacks/ui';
import { IconAlertCircle } from '@tabler/icons';
import { Text } from '@components/typography';
import { capitalize } from '@common/utils';
import { AddressLink } from '@components/links';
import { Link } from '@components/link';

export const IncorrectAddressModeNotice: React.FC<{ address: string }> = ({ address }) => {
  const network = useNetworkMode();
  const invert =
    network && (network.toLowerCase() === 'testnet' || network.toLowerCase() === 'regtest')
      ? 'mainnet'
      : 'testnet';
  return (
    <Section mb="extra-loose">
      <Flex alignItems="center" justifyContent="space-between" p="base-loose">
        <Flex alignItems="center">
          <Box mr="tight" as={IconAlertCircle} color={color('feedback-alert')} />
          <Text color={color('text-body')}>
            This is a <strong>{capitalize(invert)}</strong> address, but you are viewing data from
            the <strong>{network}</strong> Stacks Network.
          </Text>
        </Flex>

        <AddressLink principal={address}>
          <Link
            fontSize={1}
            color={color('brand')}
            textDecoration="none"
            _hover={{
              textDecoration: 'underline',
            }}
          >
            Update address
          </Link>
        </AddressLink>
      </Flex>
    </Section>
  );
};
