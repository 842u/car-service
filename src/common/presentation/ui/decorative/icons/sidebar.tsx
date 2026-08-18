import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function SidebarIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M14 43.462h29.462A5.54 5.54 0 0 0 49 37.923V12.077a5.54 5.54 0 0 0-5.538-5.538H14m0 36.923H6.538A5.54 5.54 0 0 1 1 37.923V12.077a5.54 5.54 0 0 1 5.538-5.538H14m0 36.923V6.539" />
    </SvgA11y>
  );
}
