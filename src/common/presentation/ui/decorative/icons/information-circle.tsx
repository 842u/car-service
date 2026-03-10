import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function InformationCircleIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="m22.6 21 .13-.07a2.46 2.46 0 0 1 2.57.27 2.26 2.26 0 0 1 .83 2.38l-2.26 8.8a2.26 2.26 0 0 0 .82 2.38 2.44 2.44 0 0 0 2.57.27l.14-.07M49 25.5a24 24 0 1 1-48 0 24 24 0 0 1 48 0Zm-24.51-9.77h1.02v1H24.5v-1Z" />
    </SvgA11y>
  );
}
