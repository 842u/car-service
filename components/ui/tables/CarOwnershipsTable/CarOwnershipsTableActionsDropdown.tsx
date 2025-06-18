import { EllipsisIcon } from '@/components/decorative/icons/EllipsisIcon';
import { CarOwnership } from '@/types';

import { Button } from '../../shared/base/Button/Button';
import { Dropdown } from '../../shared/base/Dropdown/Dropdown';
import { IconButton } from '../../shared/IconButton/IconButton';

type CarOwnershipsTableActionsDropdownProps = {
  isCurrentUserPrimaryOwner: boolean;
  ownership: CarOwnership;
  userId?: string;
};

export function CarOwnershipsTableActionsDropdown({
  isCurrentUserPrimaryOwner,
  ownership,
  userId,
}: CarOwnershipsTableActionsDropdownProps) {
  const canPromote = isCurrentUserPrimaryOwner && userId !== ownership.owner_id;

  const canDelete =
    (isCurrentUserPrimaryOwner && userId !== ownership.owner_id) ||
    (!isCurrentUserPrimaryOwner && userId === ownership.owner_id);

  const canTakeAction = canPromote || canDelete;

  return (
    <Dropdown className="w-12">
      <Dropdown.Trigger>
        {({ onClick, ref }) => (
          <IconButton
            ref={ref}
            disabled={!canTakeAction}
            title="Actions"
            variant="transparent"
            onClick={onClick}
          >
            {canTakeAction ? (
              <EllipsisIcon className="fill-accent-700 stroke-accent-700 dark:fill-accent-400 dark:stroke-accent-400 w-full px-1" />
            ) : (
              <EllipsisIcon className="fill-alpha-grey-500 stroke-alpha-grey-500 w-full px-1" />
            )}
          </IconButton>
        )}
      </Dropdown.Trigger>
      <Dropdown.Content snap="bottom-right">
        <Button className="w-full" disabled={!canPromote} variant="transparent">
          Promote
        </Button>
        <Button className="w-full" disabled={!canDelete} variant="error">
          Delete
        </Button>
      </Dropdown.Content>
    </Dropdown>
  );
}
