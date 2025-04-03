import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export function MoonIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 200 200"
    >
      <path d="M181 125A81 81 0 0 1 69 50c0-11 2-22 6-31a81 81 0 1 0 106 106Z" />
    </SvgA11y>
  );
}
