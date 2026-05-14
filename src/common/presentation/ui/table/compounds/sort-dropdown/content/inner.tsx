import { ChevronDownIcon } from '@/icons/chevron-down';
import { ChevronUpIcon } from '@/icons/chevron-up';
import { XMarkIcon } from '@/icons/x-mark';
import { IconButton } from '@/ui/icon-button/icon-button';

interface TableSortDropdownInnerContentProps {
  isSortDesc: boolean;
  isSorted: boolean;
  handleAscClick: () => void;
  handleDescClick: () => void;
  handleReset: () => void;
}

export function TableSortDropdownInnerContent({
  isSortDesc,
  isSorted,
  handleAscClick,
  handleDescClick,
  handleReset,
}: TableSortDropdownInnerContentProps) {
  return (
    <>
      <IconButton
        className="h-fit w-full justify-between p-2 px-3"
        text="Asc"
        variant="transparent"
        onClick={handleAscClick}
      >
        <ChevronUpIcon
          className={`h-5 w-5 stroke-3 p-0.5 ${isSorted && !isSortDesc ? 'stroke-accent-500' : 'stroke-dark-500 dark:stroke-light-500'}`}
        />
      </IconButton>
      <IconButton
        className="h-fit w-full justify-between p-2 px-3"
        text="Desc"
        variant="transparent"
        onClick={handleDescClick}
      >
        <ChevronDownIcon
          className={`h-5 w-5 stroke-3 p-0.5 ${isSorted && isSortDesc ? 'stroke-accent-500' : 'stroke-dark-500 dark:stroke-light-500'}`}
        />
      </IconButton>
      {isSorted && (
        <IconButton
          className="h-fit w-full justify-between p-2 px-3"
          text="Reset"
          variant="transparent"
          onClick={handleReset}
        >
          <XMarkIcon className="stroke-dark-500 dark:stroke-light-500 h-5 w-5 stroke-3 p-0.5" />
        </IconButton>
      )}
    </>
  );
}
