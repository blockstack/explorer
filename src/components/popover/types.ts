import { BoxProps } from '@blockstack/ui';
import { Ref } from 'react';

export interface PopoverProps extends BoxProps {
  onItemClick?: (item?: any) => void;
  dismiss?: () => void;
  itemComponent?: any;
  items: any[];
  cardProps?: BoxProps;
  wrapperProps?: BoxProps;
  label?: string;
  triggerRef: Ref<any>;
  hideItems?: boolean;
  showOnFocus?: boolean;
  isVisible?: boolean;
  showBackdrop?: boolean;
  showClose?: 'mobile' | 'always' | undefined;
  activeItem?: number;
  placement?: 'left' | 'right';
}

export interface UsePopoverProps {
  length: number;
  triggerRef: any;
  showOnFocus?: boolean;
}
