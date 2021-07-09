import * as React from 'react';

import { Box, color, FlexProps } from '@stacks/ui';

import { keyframes } from '@emotion/react';
import { css, Theme } from '@stacks/ui-core';
import { Badge } from './badge';

import { CheckIcon } from './icons/check';
import { LoaderQuarter } from './icons/loader-quarter';
import { AlertCircleIcon } from './icons/alert-circle';
import { MicroblockIcon } from './icons/microblock';

const keyframesRotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(359deg);
  }
`;

export const Pending = ({ speed = 0.9, ...p }: any) => (
  <LoaderQuarter
    css={(theme: Theme) =>
      css({
        animation: `${keyframesRotate} ${speed}s infinite linear`,
        color: 'currentColor',
      })(theme)
    }
    {...p}
  />
);

export type Statuses =
  | 'success_microblock'
  | 'success_anchor_block'
  | 'success'
  | 'pending'
  | 'failed' // todo: remove
  | 'abort_by_response'
  | 'abort_by_post_condition';

// TODO: This is unused?
const colorMap = {
  pending: 'ink.900',
  success: '#008832',
  failed: '#D4001A',
  abort_by_response: '#D4001A',
  abort_by_post_condition: '#D4001A',
};

const labelMap = {
  success_microblock: 'Included in microblock',
  success_anchor_block: 'Confirmed in anchor block',
  success: 'Confirmed',
  pending: 'Pending',
  failed: 'Failed',
  abort_by_response: 'Failed',
  abort_by_post_condition: 'Failed',
};

const iconMap = {
  success_microblock: () => <MicroblockIcon fill="white" />,
  success_anchor_block: CheckIcon,
  success: CheckIcon,
  pending: Pending,
  failed: AlertCircleIcon,
  abort_by_response: AlertCircleIcon,
  abort_by_post_condition: AlertCircleIcon,
};

interface StatusProps extends FlexProps {
  status: Statuses;
}

export const Status: React.FC<StatusProps> = ({ status, ...rest }) => {
  const IconComponent = iconMap[status];
  const label = labelMap[status];
  return (
    <Badge
      bg="rgba(255,255,255,0.24)"
      color="white"
      labelProps={{ display: 'flex', alignItems: 'center' }}
      maxHeight="24px"
      {...rest}
    >
      <IconComponent strokeWidth="2" size="16px" color="currentColor" />
      <Box ml="extra-tight">{label}</Box>
    </Badge>
  );
};
