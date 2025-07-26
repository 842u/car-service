import { EllipsisIcon } from '@/features/common/ui/decorative/icons/EllipsisIcon';
import { ServiceLog } from '@/types';

import { Dropdown } from '../../../../../features/common/ui/Dropdown/Dropdown';
import { IconButton } from '../../../../../features/common/ui/IconButton/IconButton';
import { CarServiceLogsTableActionsDropdownContent } from './CarServiceLogsTableActionsDropdownContent/CarServiceLogsTableActionsDropdownContent';

type CarServiceLogsTableActionsDropdownProps = {
  carId: string;
  serviceLog: ServiceLog;
  isCurrentUserPrimaryOwner: boolean;
  userId?: string;
  className?: string;
  collisionDetectionRoot?: HTMLElement | null;
};

export function CarServiceLogsTableActionsDropdown({
  carId,
  userId,
  serviceLog,
  isCurrentUserPrimaryOwner,
  collisionDetectionRoot,
  className,
}: CarServiceLogsTableActionsDropdownProps) {
  const canTakeAction =
    isCurrentUserPrimaryOwner || userId === serviceLog.created_by;

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
      <CarServiceLogsTableActionsDropdownContent
        canTakeAction={canTakeAction}
        carId={carId}
        serviceLog={serviceLog}
      />
    </Dropdown>
  );
}
