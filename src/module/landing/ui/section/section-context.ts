'use client';

import { createContext } from 'react';

import { useContextGuard } from '@/common/presentation/hook/use-context-guard';

type LandingSectionContextValue = { headingId: string } | null;

export const LandingSectionContext =
  createContext<LandingSectionContextValue>(null);

export function useLandingSection() {
  return useContextGuard({
    context: LandingSectionContext,
    componentName: 'LandingSection',
  });
}
