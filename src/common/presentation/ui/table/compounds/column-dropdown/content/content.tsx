import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';
import { Dropdown } from '@/ui/dropdown/dropdown';
import { TableColumnDropdownFilter } from '@/ui/table/compounds/column-dropdown/content/filter';
import { TableSortDropdownInnerContent } from '@/ui/table/compounds/sort-dropdown/content/inner';
import { useTableSortDropdownContent } from '@/ui/table/compounds/sort-dropdown/content/use-content';
import { useColumnFilterState } from '@/ui/table/use-column-filter-state';

interface TableColumnDropdownContentProps {
  columnId: string;
}

export function TableColumnDropdownContent({
  columnId,
}: TableColumnDropdownContentProps) {
  const {
    handleAscClick,
    handleDescClick,
    handleReset,
    isSortable,
    isSortDesc,
    isSorted,
  } = useTableSortDropdownContent({ columnId });

  const { filterMeta, isFilterable } = useColumnFilterState(columnId);

  return (
    <Dropdown.Content>
      {isSortable && (
        <TableSortDropdownInnerContent
          handleAscClick={handleAscClick}
          handleDescClick={handleDescClick}
          handleReset={handleReset}
          isSortDesc={isSortDesc}
          isSorted={isSorted}
        />
      )}

      {isSortable && isFilterable && filterMeta && (
        <TextSeparator
          className="text-alpha-grey-600 m-2 text-[10px]"
          text="FILTER"
        />
      )}

      {isFilterable && filterMeta && (
        <TableColumnDropdownFilter
          columnId={columnId}
          filterMeta={filterMeta}
        />
      )}
    </Dropdown.Content>
  );
}
