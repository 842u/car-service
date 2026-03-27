import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function ToolsIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="m24.16 32.8 13.45 13.46a6.12 6.12 0 0 0 8.66-8.65L32.7 24.05m-8.55 8.76 5.76-7a5.6 5.6 0 0 1 2.79-1.76 11 11 0 0 1 4.02-.32A10.38 10.38 0 0 0 47.08 9.1l-7.56 7.56a6.9 6.9 0 0 1-5.19-5.2l7.56-7.55a10.38 10.38 0 0 0-14.62 10.35c.21 2.48-.16 5.22-2.09 6.8l-.23.2m-.79 11.54L13.42 45.85a5.88 5.88 0 1 1-8.27-8.27l15.77-13-9.47-9.47H8.2L3 6.46 6.48 3l8.65 5.2v3.24l9.83 9.83-4.03 3.32M40.21 40.2l-6.06-6.05m-25.1 7.78h.01v.02h-.02z" />
    </SvgA11y>
  );
}
