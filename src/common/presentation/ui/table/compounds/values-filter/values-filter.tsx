'use client';

import { FunnelIcon } from '@/icons/funnel';
import { Dropdown } from '@/ui/dropdown/dropdown';
import { IconButton } from '@/ui/icon-button/icon-button';
import { TableValuesFilterContent } from '@/ui/table/compounds/values-filter/content';
import { useTable } from '@/ui/table/table';

interface TableValuesFilterProps {
  columnId: string;
  checkboxLabelValueMapping: Record<string, string>;
  className?: string;
}

export function TableValuesFilter({
  columnId,
  checkboxLabelValueMapping,
  className,
}: TableValuesFilterProps) {
  const { table } = useTable();

  const label = table.getColumn(columnId)?.columnDef.meta?.label;

  return (
    <Dropdown className={className}>
      <Dropdown.Trigger>
        {({ onClick, ref }) => (
          <IconButton
            ref={ref}
            className="h-fit p-2 px-3"
            iconSide="right"
            text={label}
            title={`Filter by ${label}`}
            variant="transparent"
            onClick={onClick}
          >
            <FunnelIcon className="h-5 w-5 stroke-2 p-0.5" />
          </IconButton>
        )}
      </Dropdown.Trigger>
      <Dropdown.Content>
        <TableValuesFilterContent
          checkboxLabelValueMapping={checkboxLabelValueMapping}
          columnId={columnId}
        />
      </Dropdown.Content>
    </Dropdown>
  );
}
