import { ChevronDownIcon } from '@/icons/chevron-down';
import { ChevronUpIcon } from '@/icons/chevron-up';
import { ChevronUpDownIcon } from '@/icons/chevron-up-down';

interface TableSortDropdownProps {
  isSortDesc: boolean;
  isSorted: boolean;
}

export function TableSortDropdownIcon({
  isSortDesc,
  isSorted,
}: TableSortDropdownProps) {
  return (
    <>
      {isSorted && !isSortDesc && (
        <ChevronUpIcon className="stroke-dark-500 dark:stroke-light-500 h-5 w-5 stroke-3 p-0.5" />
      )}
      {isSorted && isSortDesc && (
        <ChevronDownIcon className="stroke-dark-500 dark:stroke-light-500 h-5 w-5 stroke-3 p-0.5" />
      )}
      {!isSorted && (
        <ChevronUpDownIcon className="stroke-dark-500 dark:stroke-light-500 h-5 w-5 stroke-3 p-0.5" />
      )}
    </>
  );
}
