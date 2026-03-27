import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function SwatchIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M5.75 45.25A9.4 9.4 0 0 0 12.38 48m-6.64-2.75A9.4 9.4 0 0 0 12.39 48m-6.64-2.75A9.4 9.4 0 0 1 3 38.62V5.82A2.8 2.8 0 0 1 5.81 3h13.13a2.8 2.8 0 0 1 2.81 2.81V16M12.38 48A9.4 9.4 0 0 0 19 45.25M12.38 48c2.48 0 4.87-.99 6.62-2.75M12.38 48h32.8A2.8 2.8 0 0 0 48 45.19V32.06a2.8 2.8 0 0 0-2.81-2.81H35m-16 16 16-16m-16 16a9.4 9.4 0 0 0 2.74-6.63V16m13.26 13.26 7.2-7.2a2.8 2.8 0 0 0 0-3.98L32.92 8.8a2.8 2.8 0 0 0-3.97 0l-7.2 7.2m-9.37 22.63h.01v.02h-.02z" />
    </SvgA11y>
  );
}
