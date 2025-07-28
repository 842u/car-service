import { EllipsisIcon } from '@/features/common/ui/decorative/icons/elipsis';
import { Dropdown } from '@/features/common/ui/dropdown/dropdown';
import { IconButton } from '@/features/common/ui/IconButton/IconButton';

import {
  CarOwnershipsTableActionsDropdownContent,
  CarOwnershipsTableActionsDropdownContentProps,
} from './CarOwnershipsTableActionsDropdownContent/CarOwnershipsTableActionsDropdownContent';

type CarOwnershipsTableActionsDropdownProps = Omit<
  CarOwnershipsTableActionsDropdownContentProps,
  'canDelete' | 'canPromote'
> & {
  isCurrentUserPrimaryOwner: boolean;
  collisionDetectionRoot?: HTMLElement | null;
};

export function CarOwnershipsTableActionsDropdown({
  isCurrentUserPrimaryOwner,
  ownership,
  ownerUsername,
  collisionDetectionRoot,
  userId,
}: CarOwnershipsTableActionsDropdownProps) {
  const canPromote = isCurrentUserPrimaryOwner && userId !== ownership.owner_id;

  const canDelete =
    (isCurrentUserPrimaryOwner && userId !== ownership.owner_id) ||
    (!isCurrentUserPrimaryOwner && userId === ownership.owner_id);

  const canTakeAction = canPromote || canDelete;

  return (
    <Dropdown className="w-12" collisionDetectionRoot={collisionDetectionRoot}>
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
            <EllipsisIcon className="fill-dark-500 stroke-dark-500 dark:fill-light-500 dark:stroke-light-500 group-disabled:dark:fill-alpha-grey-500 group-disabled:dark:stroke-alpha-grey-500 group-disabled:fill-alpha-grey-500 group-disabled:stroke-alpha-grey-500 w-full px-1" />
          </IconButton>
        )}
      </Dropdown.Trigger>
      <CarOwnershipsTableActionsDropdownContent
        canDelete={canDelete}
        canPromote={canPromote}
        ownership={ownership}
        ownerUsername={ownerUsername}
        userId={userId}
      />
    </Dropdown>
  );
}
