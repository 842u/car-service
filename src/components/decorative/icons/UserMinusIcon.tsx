import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export function UserMinusIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M49 21H33m-6-11a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM1 44.3V44a17 17 0 1 1 34 0v.3A32.85 32.85 0 0 1 18 49a32.85 32.85 0 0 1-17-4.7Z" />
    </SvgA11y>
  );
}
