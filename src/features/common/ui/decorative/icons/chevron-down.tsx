import { SvgA11y, SvgA11yProps } from '../svg-a11y/svg-a11y';

export function ChevronDownIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M49 13 25 37 1 13" />
    </SvgA11y>
  );
}
