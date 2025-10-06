import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function SunIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M25 1v6m16.97 1.03-4.24 4.24M49 25h-6m-1.03 16.97-4.24-4.24M25 43v6M12.27 37.73l-4.24 4.24M7 25H1m11.27-12.73L8.03 8.03M35 25a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />
    </SvgA11y>
  );
}
