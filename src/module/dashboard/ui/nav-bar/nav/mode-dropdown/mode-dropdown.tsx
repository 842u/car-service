import { useState } from 'react';

import type { NavMode } from '@/dashboard/ui/nav-mode/nav-mode';
import { SidebarIcon } from '@/icons/sidebar';
import { Dropdown } from '@/ui/dropdown/dropdown';
import { IconButton } from '@/ui/icon-button/icon-button';

import { NavModeDropdownContent } from './content/content';
import { NAV_MODE_LABELS } from './nav-mode-labels';

type NavModeDropdownProps = {
  navMode: NavMode;
  className?: string;
};

export function NavModeDropdown({ navMode, className }: NavModeDropdownProps) {
  // Seeded from the cookie the server read, and owned here afterwards. The
  // mode itself lives on the shell's data attribute rather than in React, so
  // this state exists only to mark the checked option and to name the trigger.
  const [mode, setMode] = useState(navMode);

  return (
    <Dropdown className={className}>
      <Dropdown.Trigger>
        {(triggerProps) => (
          <IconButton
            {...triggerProps}
            className="h-full w-full"
            size="icon"
            // `auto` and `collapsed` are identical at rest, so the name has to
            // report which one is active; nothing on screen distinguishes them.
            title={`Navigation menu mode: ${NAV_MODE_LABELS[mode]}`}
            variant="transparent"
          >
            <SidebarIcon className="stroke-dark-500 dark:stroke-light-500 h-full w-full stroke-2" />
          </IconButton>
        )}
      </Dropdown.Trigger>

      <NavModeDropdownContent mode={mode} onSelect={setMode} />
    </Dropdown>
  );
}
