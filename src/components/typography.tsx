import * as React from 'react';
import { Text as BaseText, BoxProps } from '@blockstack/ui';

export const Text = (props: BoxProps) => <BaseText color="var(--colors-text-body)" {...props} />;

export const Caption: React.FC<BoxProps> = props => (
  <Text
    style={{ userSelect: 'none' }}
    color="var(--colors-text-caption)"
    fontSize="12px"
    lineHeight="16px"
    display="inline-block"
    {...props}
  />
);

export const Title: React.FC<BoxProps> = props => (
  <Text display="inline-block" {...props} color="var(--colors-text-title)" />
);

export const SectionTitle: React.FC<BoxProps> = props => (
  <Title lineHeight="28px" fontSize="20px" fontWeight="500" {...props} />
);
