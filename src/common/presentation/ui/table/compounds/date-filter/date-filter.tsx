import { inputVariants } from '@/lib/tailwindcss/input';
import { useDateFilter } from '@/ui/table/compounds/date-filter/use-date-filter';

interface TableDateFilterProps {
  columnId: string;
}

export function TableDateFilter({ columnId }: TableDateFilterProps) {
  const { columnLabel, onFromDateChange, onToDateChange } = useDateFilter({
    columnId,
  });

  return (
    <div className="my-4 flex flex-col gap-2 md:w-fit md:flex-row md:flex-wrap">
      <label className="md:grow">
        <p className="my-2 text-xs">From {columnLabel}</p>
        <input
          className={inputVariants.default}
          type="date"
          onChange={onFromDateChange}
        />
      </label>

      <label className="md:grow">
        <p className="my-2 text-xs">To {columnLabel}</p>
        <input
          className={inputVariants.default}
          type="date"
          onChange={onToDateChange}
        />
      </label>
    </div>
  );
}
