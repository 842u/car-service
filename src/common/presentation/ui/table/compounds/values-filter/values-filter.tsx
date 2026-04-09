'use client';

import { FunnelIcon } from '@/icons/funnel';
import { Dropdown } from '@/ui/dropdown/dropdown';
import { IconButton } from '@/ui/icon-button/icon-button';
import { useValuesFilter } from '@/ui/table/compounds/values-filter/use-values-filter';

interface TableValuesFilterProps {
  columnId: string;
  checkboxLabelValueMapping: Record<string, string>;
  showLabel?: boolean;
  className?: string;
}

export function TableValuesFilter({
  columnId,
  checkboxLabelValueMapping,
  showLabel = true,
  className,
}: TableValuesFilterProps) {
  const {
    columnLabel,
    selectedValues,
    handleCheckboxChange,
    allSelected,
    someSelected,
    handleToggleAll,
  } = useValuesFilter({ columnId, checkboxLabelValueMapping });

  return (
    <Dropdown className={className}>
      <Dropdown.Trigger>
        {({ onClick, ref }) => (
          <IconButton
            ref={ref}
            className="h-fit p-2 px-3"
            iconSide="right"
            text={columnLabel}
            title={`Filter by ${columnLabel}`}
            variant="transparent"
            onClick={onClick}
          >
            <FunnelIcon className="h-5 w-5 stroke-2 p-0.5" />
          </IconButton>
        )}
      </Dropdown.Trigger>
      <Dropdown.Content>
        <fieldset className="p-1">
          <legend>
            <p className={showLabel ? 'text-alpha-grey-900 my-2' : 'sr-only'}>
              Filter by {columnLabel}
            </p>
          </legend>

          <div className="flex flex-col gap-1">
            <label className="hover:bg-alpha-grey-100 cursor-pointer rounded-md px-2 py-1">
              <input
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                checked={allSelected}
                className="accent-accent-500 mr-2"
                type="checkbox"
                onChange={handleToggleAll}
              />
              All
            </label>

            {Object.keys(checkboxLabelValueMapping).map((checkboxLabel) => {
              return (
                <label
                  key={checkboxLabel}
                  className="hover:bg-alpha-grey-100 cursor-pointer rounded-md px-2 py-1"
                >
                  <input
                    checked={selectedValues.includes(
                      checkboxLabelValueMapping[checkboxLabel],
                    )}
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
