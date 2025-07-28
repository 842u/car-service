import { SvgA11y, SvgA11yProps } from '../svg-a11y';

export function MoonIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M49 33.65A24.96 24.96 0 0 1 16.35 1 24.96 24.96 0 1 0 49 33.65Z" />
    </SvgA11y>
  );
}
