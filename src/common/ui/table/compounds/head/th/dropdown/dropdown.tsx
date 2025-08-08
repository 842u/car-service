import { ChevronDownIcon } from '@/icons/chevron-down';
import { ChevronUpIcon } from '@/icons/chevron-up';
import { ChevronUpDownIcon } from '@/icons/chevron-up-down';
import { XMarkIcon } from '@/icons/x-mark';
import { Dropdown as BaseDropdown } from '@/ui/dropdown/dropdown';
import { IconButton } from '@/ui/icon-button/icon-button';
import { useTable } from '@/ui/table/table';

type ThDropdownProps = {
  columnId: string;
  label?: string;
  className?: string;
};

export function ThDropdown({ columnId, label, className }: ThDropdownProps) {
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
      </BaseDropdown.Trigger>
      <BaseDropdown.Content>
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
      </BaseDropdown.Content>
    </BaseDropdown>
  );
}
