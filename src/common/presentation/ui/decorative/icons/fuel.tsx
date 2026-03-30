import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function FuelIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M8 41H6a1 1 0 0 0-1 1v5q0 1 1 1h29q1 0 1-1v-5q0-1-1-1h-2M8 41V4q0-1 1-1h23q1 0 1 1v15M8 41h25m0 0V19m0 0h3q1 0 1 1v16q0 1 1 1h6q1 0 1-1V25m-5.5-12 4.3 7m0 0 1 1.8.2.5V25m-1.2-5H41a1 1 0 0 0-1 1v3q0 1 1 1h4m-18-6H14a1 1 0 0 1-1-1V9q0-1 1-1h13q1 0 1 1v9q0 1-1 1Z" />
    </SvgA11y>
  );
}
