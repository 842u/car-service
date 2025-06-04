import { createContext } from 'react';

import { Car } from '@/types';

type CarContextValue = Car | undefined;

export const CarContext = createContext<CarContextValue>(undefined);
