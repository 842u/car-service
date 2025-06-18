import { EllipsisIcon } from '@/components/decorative/icons/EllipsisIcon';

import { Button } from '../../shared/base/Button/Button';
import { Dropdown } from '../../shared/base/Dropdown/Dropdown';
import { IconButton } from '../../shared/IconButton/IconButton';

export function CarOwnershipsTableActionsDropdown() {
  return (
    <Dropdown className="w-12">
      <Dropdown.Trigger>
        {({ onClick, ref }) => (
          <IconButton
            ref={ref}
            title="Actions"
            variant="transparent"
            onClick={onClick}
          >
            <EllipsisIcon className="fill-dark-500 dark:fill-light-500 w-full px-1" />
          </IconButton>
        )}
      </Dropdown.Trigger>
      <Dropdown.Content snap="bottom-right">
        <Button className="w-full" variant="transparent">
          Promote
        </Button>
        <Button className="w-full" variant="error">
          Delete
        </Button>
      </Dropdown.Content>
    </Dropdown>
  );
}
