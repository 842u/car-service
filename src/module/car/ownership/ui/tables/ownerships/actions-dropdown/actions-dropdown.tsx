import { EllipsisIcon } from '@/icons/ellipsis';
import type { CarOwnership } from '@/types';
import { Dropdown } from '@/ui/dropdown/dropdown';
import { IconButton } from '@/ui/icon-button/icon-button';

import { DropdownContent } from './content/content';

interface TableActionsDropdownProps {
  canDelete: boolean;
  canPromote: boolean;
  canTakeAction: boolean;
  collisionDetectionRoot?: HTMLElement | null;
  ownership: CarOwnership;
  username?: string | null;
  sessionUserId?: string;
}

export function TableActionsDropdown({
  canDelete,
  canPromote,
  canTakeAction,
  ownership,
  username,
  collisionDetectionRoot,
  sessionUserId,
}: TableActionsDropdownProps) {
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
      <DropdownContent
        canDelete={canDelete}
        canPromote={canPromote}
        ownership={ownership}
        sessionUserId={sessionUserId}
        username={username}
      />
    </Dropdown>
  );
}
