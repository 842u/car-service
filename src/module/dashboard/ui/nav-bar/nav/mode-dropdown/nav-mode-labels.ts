import type { NavMode } from '@/dashboard/ui/nav-mode/nav-mode';

/** Shared by the trigger, which names the current mode, and by the options. */
export const NAV_MODE_LABELS: Record<NavMode, string> = {
  auto: 'Auto',
  collapsed: 'Collapsed',
  expanded: 'Expanded',
};
