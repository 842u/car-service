import { EllipsisIcon } from '@/icons/ellipsis';
import type { ServiceLog } from '@/types';
import { Dropdown } from '@/ui/dropdown/dropdown';
import { IconButton } from '@/ui/icon-button/icon-button';

import { DropdownContent } from './content/content';

interface TableActionsDropdownProps {
  carId: string;
  serviceLog: ServiceLog;
  canTakeAction: boolean;
  className?: string;
  collisionDetectionRoot?: HTMLElement | null;
}

export function TableActionsDropdown({
  carId,
  serviceLog,
  canTakeAction,
  collisionDetectionRoot,
  className,
}: TableActionsDropdownProps) {
  return (
    <Dropdown
      className={className}
      collisionDetectionRoot={collisionDetectionRoot}
    >
      <Dropdown.Trigger>
        {({ onClick, ref }) => (
          <IconButton
            ref={ref}
            className="group"
            disabled={!canTakeAction}
            title="Actions"
            variant="transparent"
            onClick={onClick}
          >
            <EllipsisIcon className="fill-dark-500 dark:fill-light-500 group-disabled:dark:fill-alpha-grey-500 group-disabled:dark:stroke-alpha-grey-500 group-disabled:fill-alpha-grey-500 group-disabled:stroke-alpha-grey-500 w-full px-1" />
          </IconButton>
        )}
      </Dropdown.Trigger>
      <DropdownContent
        canTakeAction={canTakeAction}
        carId={carId}
        serviceLog={serviceLog}
      />
    </Dropdown>
  );
}
