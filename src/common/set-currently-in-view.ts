import { currentlyInViewState, InView } from '@store/currently-in-view';

export function setCurrentlyInView(type: InView['type'], payload: InView['payload']) {
  return [currentlyInViewState, { type, payload }] as const;
}
