import type { AllModals } from '@common/constants';
import { atom } from 'jotai';

export const modalState = atom<AllModals | null>(null);
