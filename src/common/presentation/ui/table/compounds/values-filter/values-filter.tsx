'use client';

import { FunnelIcon } from '@/icons/funnel';
import { Dropdown } from '@/ui/dropdown/dropdown';
import { IconButton } from '@/ui/icon-button/icon-button';
import { useValuesFilter } from '@/ui/table/compounds/values-filter/use-values-filter';

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
  const { columnLabel, handleCheckboxChange } = useValuesFilter({ columnId });

  return (
    <Dropdown className={className}>
      <Dropdown.Trigger>
        {({ onClick, ref }) => (
          <IconButton
            ref={ref}
            className="border-alpha-grey-200 bg-alpha-grey-50 px-2"
            iconSide="left"
            text={columnLabel}
            title={`Filter by ${columnLabel}`}
            onClick={onClick}
          >
            <FunnelIcon className="stroke-accent-500 h-5 w-5 stroke-2" />
          </IconButton>
        )}
      </Dropdown.Trigger>
      <Dropdown.Content>
        <fieldset className="p-1">
          <legend>
            <p className="text-alpha-grey-900 my-2">Filter by {columnLabel}</p>
          </legend>
          <div className="flex flex-col gap-1">
            {Object.keys(checkboxLabelValueMapping).map((checkboxLabel) => {
              return (
                <label
                  key={checkboxLabel}
                  className="hover:bg-alpha-grey-100 cursor-pointer rounded-md px-2 py-1"
                >
                  <input
                    className="accent-accent-500 mr-2"
                    id={`checkbox-${checkboxLabel}`}
                    name={columnId}
                    type="checkbox"
                    value={checkboxLabelValueMapping[checkboxLabel]}
                    onChange={handleCheckboxChange}
                  />
                  {checkboxLabel}
                </label>
              );
            })}
          </div>
        </fieldset>
      </Dropdown.Content>
    </Dropdown>
  );
}
