import { atomFamily } from 'jotai/utils';
import { atom } from 'jotai';

export const tabIndexState = atomFamily<string, number, number>(_param => atom(0));
