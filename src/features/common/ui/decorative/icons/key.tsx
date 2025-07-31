import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function KeyIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M15.77 8.38a7.38 7.38 0 0 0-7.39 7.38m-7.38 0a14.77 14.77 0 0 0 17.3 14.56 4.35 4.35 0 0 1 3.85 1.05l6.54 6.55h5.54v5.54h5.54v5.53H49v-6.93c0-1.47-.58-2.88-1.62-3.92l-16-16c-1-1-1.3-2.46-1.06-3.84A14.77 14.77 0 1 0 1 15.76Z" />
    </SvgA11y>
  );
}
