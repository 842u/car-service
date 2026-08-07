type TableIdentifierCellProps = {
  value?: string | null;
};

/**
 * Renders an opaque identifier (uuid, VIN, plate) on a single line with an
 * ellipsis, and the full value in the tooltip. Pair it with `shouldSpan` on the
 * column so the cell has a width range to clamp against.
 */
export function TableIdentifierCell({ value }: TableIdentifierCellProps) {
  return (
    <div className="line-clamp-1" title={value ?? undefined}>
      {value}
    </div>
  );
}
