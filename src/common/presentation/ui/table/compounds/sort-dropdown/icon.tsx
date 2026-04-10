import { ChevronDownIcon } from '@/icons/chevron-down';
import { ChevronUpIcon } from '@/icons/chevron-up';
import { ChevronUpDownIcon } from '@/icons/chevron-up-down';

interface TableSortDropdownProps {
  columnSortDesc: boolean;
  isColumnSortSet: boolean;
}

export function TableSortDropdownIcon({
  columnSortDesc,
  isColumnSortSet,
}: TableSortDropdownProps) {
  return (
    <>
      {isColumnSortSet && !columnSortDesc && (
        <ChevronUpIcon className="stroke-dark-500 dark:stroke-light-500 h-5 w-5 stroke-3 p-0.5" />
      )}
      {isColumnSortSet && columnSortDesc && (
        <ChevronDownIcon className="stroke-dark-500 dark:stroke-light-500 h-5 w-5 stroke-3 p-0.5" />
      )}
      {!isColumnSortSet && (
        <ChevronUpDownIcon className="stroke-dark-500 dark:stroke-light-500 h-5 w-5 stroke-3 p-0.5" />
      )}
    </>
  );
}
