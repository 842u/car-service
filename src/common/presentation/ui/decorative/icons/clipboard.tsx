import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function ClipboardIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M34.05 6.78A5.2 5.2 0 0 0 29 3h-7c-2.4 0-4.43 1.6-5.05 3.78m17.1 0q.2.67.2 1.41c0 .46-.18.9-.51 1.23s-.78.5-1.24.5h-14q-.71-.01-1.24-.5a1.7 1.7 0 0 1-.51-1.23q0-.74.2-1.41m17.1 0q2.26.17 4.5.42A5.05 5.05 0 0 1 43 12.25V42.8c0 1.37-.55 2.7-1.54 3.67A5.3 5.3 0 0 1 37.75 48h-24.5c-1.4 0-2.73-.55-3.71-1.52A5.2 5.2 0 0 1 8 42.8V12.25a5.05 5.05 0 0 1 4.45-5.05q2.25-.25 4.5-.42" />
    </SvgA11y>
  );
}
