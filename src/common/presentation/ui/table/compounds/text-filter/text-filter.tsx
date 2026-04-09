import { twMerge } from 'tailwind-merge';

import { SearchIcon } from '@/icons/search';
import { useTextFilter } from '@/ui/table/compounds/text-filter/use-text-filter';

interface TableTextFilterProps {
  columnId: string;
  debounceDelay?: number;
  className?: string;
}

export function TableTextFilter({
  columnId,
  debounceDelay,
  className,
}: TableTextFilterProps) {
  const { columnLabel, inputId, handleInputChange } = useTextFilter({
    columnId,
    debounceDelay,
  });

  return (
    <label
      className={twMerge(
        'border-alpha-grey-200 bg-alpha-grey-50 focus-within:ring-accent-500 flex h-10 w-full items-center rounded-md border focus-within:ring-1',
        className,
      )}
    >
      <SearchIcon
        aria-hidden="true"
        className="stroke-accent-500 dark:accent-accent-400 pointer-events-none ml-2 h-5 w-5 shrink-0 stroke-3"
      />

      <span className="sr-only">Filter {columnLabel}</span>

      <input
        className="placeholder:text-alpha-grey-900 ml-2 w-full outline-none"
        id={inputId}
        placeholder={`Search by ${columnLabel}`}
        type="text"
        onChange={handleInputChange}
      />
    </label>
  );
}
