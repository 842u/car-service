'use client';

import { createContext } from 'react';

import { useContextGuard } from '@/common/presentation/hook/use-context-guard';

type DashboardSectionContextValue = { headingId: string } | null;

export const DashboardSectionContext =
  createContext<DashboardSectionContextValue>(null);

export function useDashboardSection() {
  return useContextGuard({
    context: DashboardSectionContext,
    componentName: 'DashboardSection',
  });
}
