import { SvgA11y, SvgA11yProps } from '../svg-a11y/svg-a11y';

export function CheckCircleIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="m12.5 26.79 9.38 10.71 15.62-25M49 25a24 24 0 1 1-48 0 24 24 0 0 1 48 0Z" />
    </SvgA11y>
  );
}
