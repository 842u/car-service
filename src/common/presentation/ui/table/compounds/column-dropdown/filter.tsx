import type { ColumnMeta } from '@tanstack/react-table';

import { TableValuesFilterContent } from '@/ui/table/compounds/values-filter/content';

import { TableDateFilter } from '../date-filter/date-filter';
import { TableTextFilter } from '../text-filter/text-filter';

interface TableColumnDropdownFilterProps {
  columnId: string;
  filter: NonNullable<ColumnMeta<unknown, unknown>['filter']>;
}

export function TableColumnDropdownFilter({
  columnId,
  filter,
}: TableColumnDropdownFilterProps) {
  return (
    <div>
      {filter.type === 'text' && (
        <TableTextFilter className="min-w-[20ch]" columnId={columnId} />
      )}
      {filter.type === 'date' && <TableDateFilter columnId={columnId} />}
      {filter.type === 'values' && (
        <TableValuesFilterContent
          checkboxLabelValueMapping={filter.valuesMapping}
          columnId={columnId}
        />
      )}
    </div>
  );
}
