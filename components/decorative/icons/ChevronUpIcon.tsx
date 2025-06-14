import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export function ChevronUpIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="m1 37 24-24 24 24" />
    </SvgA11y>
  );
}
