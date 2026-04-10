import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';
import { useValuesFilter } from '@/ui/table/compounds/values-filter/use-values-filter';

interface TableValuesFilterContentProps {
  columnId: string;
  checkboxLabelValueMapping: Record<string, string>;
}

export function TableValuesFilterContent({
  columnId,
  checkboxLabelValueMapping,
}: TableValuesFilterContentProps) {
  const {
    label,
    selectedValues,
    handleCheckboxChange,
    allSelected,
    someSelected,
    handleToggleAll,
  } = useValuesFilter({
    columnId,
    checkboxLabelValueMapping,
  });

  return (
    <fieldset className="p-1">
      <legend>
        <p className="sr-only">Filter by {label}</p>
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

        <TextSeparator />

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
  );
}
