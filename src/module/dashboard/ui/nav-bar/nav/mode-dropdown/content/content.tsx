import type { NavMode } from '@/dashboard/ui/nav-mode/nav-mode';
import { NAV_MODES } from '@/dashboard/ui/nav-mode/nav-mode';
import { CheckIcon } from '@/icons/check';
import { Dropdown } from '@/ui/dropdown/dropdown';
import { IconButton } from '@/ui/icon-button/icon-button';

import { NAV_MODE_LABELS } from '../nav-mode-labels';
import { useNavModeDropdownContent } from './use-content';

type NavModeDropdownContentProps = {
  mode: NavMode;
  onSelect: (mode: NavMode) => void;
};

export function NavModeDropdownContent({
  mode,
  onSelect,
}: NavModeDropdownContentProps) {
  const { handleSelect } = useNavModeDropdownContent({ onSelect });

  return (
    <Dropdown.Content align="start" side="top">
      {/* One button per mode rather than a radio group. A radio group is a
          single tab stop by design: Tab lands on the mode already in use and
          the next Tab leaves the panel, which leaves the other two modes
          reachable only by arrow keys, and an arrow key there both moves and
          picks. A button per mode is one tab stop per mode, and picking stays
          a deliberate press. */}
      <fieldset className="p-1">
        <legend>
          <span className="sr-only">Navigation menu mode</span>
        </legend>

        <div className="flex flex-col gap-1">
          {NAV_MODES.map((option) => (
            <IconButton
              key={option}
              aria-pressed={option === mode}
              className="w-full justify-between"
              size="sm"
              text={NAV_MODE_LABELS[option]}
              variant="transparent"
              onClick={() => handleSelect(option)}
            >
              {/* Rendered on every option so the labels keep their place as
                  the mark moves between them. */}
              <CheckIcon
                className={`h-5 w-5 stroke-4 p-0.5 ${option === mode ? 'stroke-accent-500' : 'stroke-transparent'}`}
              />
            </IconButton>
          ))}
        </div>
      </fieldset>
    </Dropdown.Content>
  );
}
