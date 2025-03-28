import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export function SignOutIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 200 200"
    >
      <path d="M131 75V44a19 19 0 0 0-18-19H63a19 19 0 0 0-19 19v112a19 19 0 0 0 19 19h50a19 19 0 0 0 18-19v-31m25 0 25-25m0 0-25-25m25 25H75" />
    </SvgA11y>
  );
}
