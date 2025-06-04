import { use } from 'react';

import { CarContext } from '@/context/CarContext';

export function useCarContext() {
  const context = use(CarContext);

  if (!context) {
    throw new Error('Must wrap useCarContext in CarContextProvider.');
  }

  return context;
}
