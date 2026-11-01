import type { KeyboardEvent } from 'react';

/** Key handler that makes a role="button" element react to Enter / Space. */
export const onActivateKey = (callback: () => void) => (event: KeyboardEvent): void => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback();
  }
};
