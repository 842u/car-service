import { twMerge } from 'tailwind-merge';

import { ArrowIcon } from '@/icons/arrow';
import { useDateFilter } from '@/ui/table/compounds/date-filter/use-date-filter';
import { wrapperFocusClassName } from '@/ui/variants/focus';

type TableDateFilterProps = {
  columnId: string;
};

export function TableDateFilter({ columnId }: TableDateFilterProps) {
  const { columnLabel, onFromDateChange, onToDateChange, fromDate, toDate } =
    useDateFilter({
      columnId,
    });

  return (
    <div className="border-alpha-grey-200 bg-alpha-grey-50 flex flex-col rounded-md border md:h-10 md:flex-row md:items-center md:justify-evenly md:gap-2 md:p-1">
      <label
        className={twMerge(
          'hover:bg-alpha-grey-100 m-2 cursor-pointer rounded-sm p-2 transition-colors duration-200 md:m-0 md:p-1',
          wrapperFocusClassName,
        )}
      >
        <span className="sr-only block">From {columnLabel}</span>
        <input
          className="text-alpha-grey-900 h-full w-full cursor-pointer focus-visible:outline-none"
          type="date"
          value={fromDate}
          onChange={onFromDateChange}
        />
      </label>

      <ArrowIcon className="stroke-accent-500 mx-auto h-5 w-5 rotate-90 stroke-3 md:mx-0 md:rotate-0" />

      <label
        className={twMerge(
          'hover:bg-alpha-grey-100 m-2 cursor-pointer rounded-sm p-2 transition-colors duration-200 md:m-0 md:p-1',
          wrapperFocusClassName,
        )}
      >
        <span className="sr-only block">To {columnLabel}</span>
        <input
          className="text-alpha-grey-900 h-full w-full cursor-pointer focus-visible:outline-none"
          type="date"
          value={toDate}
          onChange={onToDateChange}
        />
      </label>
    </div>
  );
}
