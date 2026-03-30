import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function LabelIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M19.07 3H8.51A5.5 5.5 0 0 0 3 8.5v10.57a5.5 5.5 0 0 0 1.61 3.9L28.06 46.4a5.1 5.1 0 0 0 6.38.8 44 44 0 0 0 12.78-12.77 5.1 5.1 0 0 0-.8-6.38L22.96 4.62A5.5 5.5 0 0 0 19.07 3" />
      <path d="M10.34 10.34h.02v.02h-.02z" />
    </SvgA11y>
  );
}
