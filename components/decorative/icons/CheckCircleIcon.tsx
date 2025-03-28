import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export function CheckCircleIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 200 200"
    >
      <path d="m75 106 19 19 31-44m50 19a75 75 0 1 1-150 0 75 75 0 0 1 150 0Z" />
    </SvgA11y>
  );
}
