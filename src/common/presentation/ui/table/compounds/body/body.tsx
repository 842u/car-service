import type { RefObject } from 'react';
import { twMerge } from 'tailwind-merge';

import { SearchIcon } from '@/icons/search';
import { EmptyStatePlaceholder } from '@/ui/empty-state-placeholder/empty-state-placeholder';

import { useTable } from '../../use-table';

type TableBodyProps = {
  lastRowRef?: RefObject<HTMLTableRowElement | null>;
};

export function TableBody({ lastRowRef }: TableBodyProps) {
  const { table } = useTable();

  const rows = table.getRowModel().rows;
  const columnCount = table.getVisibleLeafColumns().length;

  if (rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={columnCount}>
            <EmptyStatePlaceholder
              icon={SearchIcon}
              subtext="No data matches your current filters or sorting. Try broadening your search."
              text="No matching results"
            />
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {rows.map((row, index) => (
        <tr
          key={row.id}
          ref={index === rows.length - 1 ? lastRowRef : null}
          className="hover:bg-alpha-grey-100 last:*:border-b-0"
        >
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className={twMerge(
                'border-alpha-grey-200 border-b px-5 py-1 whitespace-nowrap',
                // `wrap-anywhere` rather than `break-all`: both drop
                // min-content to a single character, which is what makes the
                // column elastic, but `wrap-anywhere` only breaks mid-word
                // when the line cannot fit. `min-w-28` puts a readable floor
                // back under the shrinking.
                cell.column.columnDef.meta?.shouldSpan &&
                  'min-w-28 wrap-anywhere whitespace-normal',
              )}
            >
              <table.FlexRender cell={cell} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
