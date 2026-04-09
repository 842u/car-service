import { ArrowIcon } from '@/icons/arrow';
import { useDateFilter } from '@/ui/table/compounds/date-filter/use-date-filter';

interface TableDateFilterProps {
  columnId: string;
}

export function TableDateFilter({ columnId }: TableDateFilterProps) {
  const { columnLabel, onFromDateChange, onToDateChange } = useDateFilter({
    columnId,
  });

  return (
    <div className="border-alpha-grey-200 bg-alpha-grey-50 flex flex-col rounded-md border md:h-10 md:flex-row md:items-center md:justify-evenly md:gap-2 md:p-1">
      <label className="hover:bg-alpha-grey-100 focus-within:ring-accent-500 m-2 cursor-pointer rounded-sm p-2 transition-colors duration-200 focus-within:ring-1 md:m-0 md:p-1">
        <p className="sr-only">From {columnLabel}</p>
        <input
          className="text-alpha-grey-900 h-full w-full cursor-pointer outline-none"
          title={`From ${columnLabel}`}
          type="date"
          onChange={onFromDateChange}
        />
      </label>

      <ArrowIcon className="stroke-accent-500 mx-auto h-5 w-5 rotate-90 stroke-3 md:mx-0 md:rotate-0" />

      <label className="hover:bg-alpha-grey-100 focus-within:ring-accent-500 m-2 cursor-pointer rounded-sm p-2 transition-colors duration-200 focus-within:ring-1 md:m-0 md:p-1">
        <p className="sr-only">To {columnLabel}</p>
        <input
          className="text-alpha-grey-900 h-full w-full cursor-pointer outline-none"
          title={`To ${columnLabel}`}
          type="date"
          onChange={onToDateChange}
        />
      </label>
    </div>
  );
}
