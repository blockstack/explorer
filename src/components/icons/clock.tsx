import React from 'react';
import { Box, BoxProps } from '@stacks/ui';
import { FiClock } from 'react-icons/fi';

export const ClockIcon: React.FC<BoxProps> = props => <Box as={FiClock} {...props} />;
