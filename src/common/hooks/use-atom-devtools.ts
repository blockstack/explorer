import { PrimitiveAtom } from 'jotai';
import { devtoolAtom } from 'jotai-query-toolkit';
import { useAtomValue } from 'jotai/utils';

export function useAtomDevtools<Value = any>(anAtom: PrimitiveAtom<Value>) {
  useAtomValue(devtoolAtom(anAtom));
}
