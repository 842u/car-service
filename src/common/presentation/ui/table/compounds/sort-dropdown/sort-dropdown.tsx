import { Dropdown as BaseDropdown } from '@/ui/dropdown/dropdown';
import { IconButton } from '@/ui/icon-button/icon-button';
import { TableSortDropdownContent } from '@/ui/table/compounds/sort-dropdown/content';
import { TableSortDropdownIcon } from '@/ui/table/compounds/sort-dropdown/icon';
import { useSort } from '@/ui/table/use-sort';

interface TableSortDropdownProps {
  columnId: string;
  label?: string;
  className?: string;
}

export function TableSortDropdown({
  columnId,
  label,
  className,
}: TableSortDropdownProps) {
  const {
    columnSortDesc,
    handleAscClick,
    handleDescClick,
    handleReset,
    isColumnSortSet,
  } = useSort(columnId);

  return (
    <BaseDropdown className={className}>
      <BaseDropdown.Trigger>
        {({ onClick, ref }) => (
          <IconButton
            ref={ref}
            className="h-fit p-2 px-3"
            text={label}
            title="sort"
            variant="transparent"
            onClick={onClick}
          >
            <TableSortDropdownIcon
              columnSortDesc={columnSortDesc}
              isColumnSortSet={isColumnSortSet}
            />
          </IconButton>
        )}
      </BaseDropdown.Trigger>
      <BaseDropdown.Content>
        <TableSortDropdownContent
          columnSortDesc={columnSortDesc}
          handleAscClick={handleAscClick}
          handleDescClick={handleDescClick}
          handleReset={handleReset}
          isColumnSortSet={!!isColumnSortSet}
        />
      </BaseDropdown.Content>
    </BaseDropdown>
  );
}
