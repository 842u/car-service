import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function DriveIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M17.25 41.6V47a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V36.22a1 1 0 0 1 1-1h6.25a1 1 0 0 1 1 1zm0 0h5.16m11.34 0V47a1 1 0 0 0 1 1H41a1 1 0 0 0 1-1V36.22a1 1 0 0 0-1-1h-6.25a1 1 0 0 0-1 1zm0 0h-5.16m-.51-32.2V7.57a1 1 0 0 0-1-1h-3.16a1 1 0 0 0-1 1v1.81m5.16 0v1.81a1 1 0 0 1-1 1H25.5m2.58-2.8h5.67m0 0V4a1 1 0 0 1 1-1H41a1 1 0 0 1 1 1v10.78a1 1 0 0 1-1 1h-6.25a1 1 0 0 1-1-1zm-10.83 0v1.8a1 1 0 0 0 1 1h1.58m-2.58-2.8h-5.67m0 0V4a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1v10.78a1 1 0 0 0 1 1h6.25a1 1 0 0 0 1-1zm5.16 32.2v-2.32a1 1 0 0 1 1-1h2.09m-3.1 3.33h6.2m0 0v-2.33a1 1 0 0 0-1-1h-2.1m0 0V12.2" />
    </SvgA11y>
  );
}
