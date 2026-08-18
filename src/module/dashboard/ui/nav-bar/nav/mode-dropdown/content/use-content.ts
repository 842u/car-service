import type { NavMode } from '@/dashboard/ui/nav-mode/nav-mode';
import { applyNavMode } from '@/dashboard/ui/nav-mode/nav-mode';
import { useDropdown } from '@/ui/dropdown/dropdown';

type UseNavModeDropdownContentParams = {
  onSelect: (mode: NavMode) => void;
};

export function useNavModeDropdownContent({
  onSelect,
}: UseNavModeDropdownContentParams) {
  const { close } = useDropdown();

  const handleSelect = (mode: NavMode) => {
    onSelect(mode);
    applyNavMode(mode);

    // Picking a mode is the whole errand, and the result is visible behind the
    // panel. Closing also hands focus back to the trigger, whose name is what
    // reports which mode is now active.
    close();
  };

  return { handleSelect };
}
