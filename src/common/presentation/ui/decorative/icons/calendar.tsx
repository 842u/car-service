import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function CalendarIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M12 3v6m27-6v6M3 42V14a6 6 0 0 1 6-5h33a6 6 0 0 1 6 5v28M3 42a6 6 0 0 0 6 6h33a6 6 0 0 0 6-6M3 42V24a6 6 0 0 1 6-6h33a6 6 0 0 1 6 6v18" />
    </SvgA11y>
  );
}
