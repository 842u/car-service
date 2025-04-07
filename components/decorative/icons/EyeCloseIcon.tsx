import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export function EyeCloseIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M5.88 16.5a24.98 24.98 0 0 0-4.88 9 25.05 25.05 0 0 0 30.83 16.94m-20.6-30.7A25.05 25.05 0 0 1 49 25.5a25.09 25.09 0 0 1-10.23 13.76M11.24 11.74l-7.7-7.7m7.7 7.7 8.7 8.7m18.82 18.82 7.7 7.7m-7.7-7.7-8.7-8.7a7.16 7.16 0 0 0-10.12-10.12m10.12 10.12L19.95 20.45" />
    </SvgA11y>
  );
}
