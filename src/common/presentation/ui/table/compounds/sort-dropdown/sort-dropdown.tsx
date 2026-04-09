import { ChevronDownIcon } from '@/icons/chevron-down';
import { ChevronUpIcon } from '@/icons/chevron-up';
import { ChevronUpDownIcon } from '@/icons/chevron-up-down';
import { XMarkIcon } from '@/icons/x-mark';
import { Dropdown as BaseDropdown } from '@/ui/dropdown/dropdown';
import { IconButton } from '@/ui/icon-button/icon-button';
import { useTable } from '@/ui/table/table';

interface TableSortDropdownProps {
  columnId: string;
  label?: string;
  className?: string;
}

export function TableSortDropdown({
  columnId,
  label,
  className,
}: TableSortDropdownProps) {
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
    <BaseDropdown className={className}>
      <BaseDropdown.Trigger>
        {({ onClick, ref }) => (
          <IconButton
            ref={ref}
            className="h-fit p-2 px-3"
            text={label}
            title="sort"
            variant="transparent"
            onClick={onClick}
          >
            {isColumnSortSet && !columnSortDesc && (
              <ChevronUpIcon className="stroke-dark-500 dark:stroke-light-500 h-5 w-5 stroke-3 p-0.5" />
            )}
            {isColumnSortSet && columnSortDesc && (
              <ChevronDownIcon className="stroke-dark-500 dark:stroke-light-500 h-5 w-5 stroke-3 p-0.5" />
            )}
            {!isColumnSortSet && (
              <ChevronUpDownIcon className="stroke-dark-500 dark:stroke-light-500 h-5 w-5 stroke-3 p-0.5" />
            )}
          </IconButton>
        )}
      </BaseDropdown.Trigger>
      <BaseDropdown.Content>
        <IconButton
          className="h-fit w-full justify-between p-2 px-3"
          text="Asc"
          variant="transparent"
          onClick={handleAscButtonClick}
        >
          <ChevronUpIcon
            className={`h-5 w-5 stroke-3 p-0.5 ${isColumnSortSet && !columnSortDesc ? 'stroke-accent-500' : 'stroke-dark-500 dark:stroke-light-500'}`}
          />
        </IconButton>
        <IconButton
          className="h-fit w-full justify-between p-2 px-3"
          text="Desc"
          variant="transparent"
          onClick={handleDescButtonClick}
        >
          <ChevronDownIcon
            className={`h-5 w-5 stroke-3 p-0.5 ${isColumnSortSet && columnSortDesc ? 'stroke-accent-500' : 'stroke-dark-500 dark:stroke-light-500'}`}
          />
        </IconButton>
        {isColumnSortSet && (
          <IconButton
            className="h-fit w-full justify-between p-2 px-3"
            text="Reset"
            variant="transparent"
            onClick={handleResetButtonClick}
          >
            <XMarkIcon className="stroke-dark-500 dark:stroke-light-500 h-5 w-5 stroke-3 p-0.5" />
          </IconButton>
        )}
      </BaseDropdown.Content>
    </BaseDropdown>
  );
}
