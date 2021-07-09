import React from 'react';
import { Box, BoxProps } from '@stacks/ui';
import { FiCheck } from 'react-icons/fi';

export const AnchorBlockIcon: React.FC<BoxProps> = props => <Box as={FiCheck} {...props} />;
