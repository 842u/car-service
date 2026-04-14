import type { ColumnMeta } from '@tanstack/react-table';

import { TableValuesFilterContent } from '@/ui/table/compounds/values-filter/content';

import { TableDateFilter } from '../../date-filter/date-filter';
import { TableTextFilter } from '../../text-filter/text-filter';

interface TableColumnDropdownFilterProps {
  columnId: string;
  filterMeta: NonNullable<ColumnMeta<unknown, unknown>['filter']>;
}

export function TableColumnDropdownFilter({
  columnId,
  filterMeta,
}: TableColumnDropdownFilterProps) {
  return (
    <div>
      {filterMeta.type === 'text' && (
        <TableTextFilter className="min-w-[20ch]" columnId={columnId} />
      )}
      {filterMeta.type === 'date' && <TableDateFilter columnId={columnId} />}
      {filterMeta.type === 'values' && (
        <TableValuesFilterContent
          checkboxLabelValueMapping={filterMeta.valuesMapping}
          columnId={columnId}
        />
      )}
    </div>
  );
}
