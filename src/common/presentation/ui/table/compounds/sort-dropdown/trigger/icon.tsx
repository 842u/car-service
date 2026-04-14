import { ChevronDownIcon } from '@/icons/chevron-down';
import { ChevronUpIcon } from '@/icons/chevron-up';
import { ChevronUpDownIcon } from '@/icons/chevron-up-down';

interface TableSortDropdownProps {
  isColumnSortDesc: boolean;
  isColumnSortSet: boolean;
}

export function TableSortDropdownIcon({
  isColumnSortDesc,
  isColumnSortSet,
}: TableSortDropdownProps) {
  return (
    <>
      {isColumnSortSet && !isColumnSortDesc && (
        <ChevronUpIcon className="stroke-dark-500 dark:stroke-light-500 h-5 w-5 stroke-3 p-0.5" />
      )}
      {isColumnSortSet && isColumnSortDesc && (
        <ChevronDownIcon className="stroke-dark-500 dark:stroke-light-500 h-5 w-5 stroke-3 p-0.5" />
      )}
      {!isColumnSortSet && (
        <ChevronUpDownIcon className="stroke-dark-500 dark:stroke-light-500 h-5 w-5 stroke-3 p-0.5" />
      )}
    </>
  );
}
