import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import { EllipsisIcon } from '@/icons/ellipsis';
import { Dropdown } from '@/ui/dropdown/dropdown';
import { IconButton } from '@/ui/icon-button/icon-button';

import { DropdownContent } from './content/content';

type TableActionsDropdownProps = {
  carId: string;
  serviceLog: ServiceLogDto;
  canTakeAction: boolean;
  className?: string;
  collisionDetectionRoot?: HTMLElement | null;
};

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
        {(triggerProps) => (
          <IconButton
            {...triggerProps}
            className="group"
            disabled={!canTakeAction}
            title="Actions"
            variant="transparent"
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
