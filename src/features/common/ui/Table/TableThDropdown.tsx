import { ChevronDownIcon } from '@/features/common/ui/decorative/icons/chevron-down';
import { ChevronUpIcon } from '@/features/common/ui/decorative/icons/chevron-up';
import { ChevronUpDownIcon } from '@/features/common/ui/decorative/icons/chevron-up-down';
import { XMarkIcon } from '@/features/common/ui/decorative/icons/x-mark';

import { Dropdown } from '../Dropdown/Dropdown';
import { IconButton } from '../IconButton/IconButton';
import { useTable } from './Table';

type TableThDropdownProps = {
  columnId: string;
  label?: string;
  className?: string;
};

export function TableThDropdown({
  columnId,
  label,
  className,
}: TableThDropdownProps) {
  const { table } = useTable();

  const column = table.getColumn(columnId);

  const isColumnSortSet = column?.getIsSorted();

  const columnsSortState = table.getState().sorting;

  const columnSortState = columnsSortState.find(
    (column) => column.id === columnId,
  );

  const columnSortDesc = columnSortState?.desc;

  const handleAscButtonClick = () => {
    table.setSorting((currentSorting) => {
      const intrinsicSort = table.options.meta?.intrinsicSort;

      const newSortingState = [...currentSorting].filter(
        (sort) => sort.id !== intrinsicSort?.id,
      );

      if (isColumnSortSet && columnSortState) {
        columnSortState.desc = false;
      } else {
        newSortingState.push({ id: columnId, desc: false });
      }

      intrinsicSort && newSortingState.push(intrinsicSort);

      return newSortingState;
    });
  };

  const handleDescButtonClick = () => {
    table.setSorting((currentSorting) => {
      const intrinsicSort = table.options.meta?.intrinsicSort;

      const newSortingState = [...currentSorting].filter(
        (sort) => sort.id !== intrinsicSort?.id,
      );

      if (isColumnSortSet && columnSortState) {
        columnSortState.desc = true;
      } else {
        newSortingState.push({ id: columnId, desc: true });
      }

      intrinsicSort && newSortingState.push(intrinsicSort);

      return newSortingState;
    });
  };

  const handleResetButtonClick = () => {
    column?.clearSorting();
  };

  return (
    <Dropdown className={className}>
      <Dropdown.Trigger>
        {({ onClick, ref }) => (
          <IconButton
            ref={ref}
            className="px-1"
            text={label}
            title="sort"
            variant="transparent"
            onClick={onClick}
          >
            {isColumnSortSet && !columnSortDesc && (
              <ChevronUpIcon className="stroke-dark-500 dark:stroke-light-500 h-full stroke-[5] py-2.5" />
            )}
            {isColumnSortSet && columnSortDesc && (
              <ChevronDownIcon className="stroke-dark-500 dark:stroke-light-500 h-full stroke-[5] py-2.5" />
            )}
            {!isColumnSortSet && (
              <ChevronUpDownIcon className="stroke-dark-500 dark:stroke-light-500 h-full stroke-[5] py-2" />
            )}
          </IconButton>
        )}
      </Dropdown.Trigger>
      <Dropdown.Content>
        <IconButton
          className="w-full justify-between pr-0"
          text="Asc"
          variant="transparent"
          onClick={handleAscButtonClick}
        >
          <ChevronUpIcon
            className={`aspect-square h-full py-2.5 ${isColumnSortSet && !columnSortDesc ? 'stroke-accent-500 stroke-[7]' : 'stroke-dark-500 dark:stroke-light-500 stroke-[5]'}`}
          />
        </IconButton>
        <IconButton
          className="w-full justify-between pr-0"
          text="Desc"
          variant="transparent"
          onClick={handleDescButtonClick}
        >
          <ChevronDownIcon
            className={`aspect-square h-full py-2.5 ${isColumnSortSet && columnSortDesc ? 'stroke-accent-500 stroke-[7]' : 'stroke-dark-500 dark:stroke-light-500 stroke-[5]'}`}
          />
        </IconButton>
        {isColumnSortSet && (
          <IconButton
            className="w-full justify-between pr-0"
            text="Reset"
            variant="transparent"
            onClick={handleResetButtonClick}
          >
            <XMarkIcon className="stroke-dark-500 dark:stroke-light-500 aspect-square h-full stroke-[7] py-2.5" />
          </IconButton>
        )}
      </Dropdown.Content>
    </Dropdown>
  );
}
