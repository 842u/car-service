import type { ComponentProps, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type TruncatedTextProps = ComponentProps<'p'> & {
  text?: string | number | null;
  fallback?: ReactNode;
};

/**
 * Clamps `text` to one line with an ellipsis and puts the full value in the
 * tooltip. Taking the text as a prop rather than as children is what keeps the
 * two in sync: a `title` built at the call site has to spell out its own
 * null handling, and `String(null)` is a tooltip reading "null".
 *
 * `truncate` implies `whitespace-nowrap`, which fixes min-content at the whole
 * string. Cells of a `shouldSpan` column need the opposite and clamp with
 * `line-clamp-1` instead; see `TableIdentifierCell`.
 */
export function TruncatedText({
  text,
  fallback,
  className,
  ...props
}: TruncatedTextProps) {
  return (
    <p
      className={twMerge('truncate', className)}
      title={text?.toString()}
      {...props}
    >
      {text ?? fallback}
    </p>
  );
}
