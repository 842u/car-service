import { SvgA11y, SvgA11yProps } from '../svg-a11y/svg-a11y';

export function XCircleIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="m15 15 10 10m0 0 10 10M25 25l10-10M25 25 15 35m34-10a24 24 0 1 1-48 0 24 24 0 0 1 48 0Z" />
    </SvgA11y>
  );
}
