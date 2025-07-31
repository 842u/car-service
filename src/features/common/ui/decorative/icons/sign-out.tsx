import { SvgA11y, SvgA11yProps } from '../svg-a11y/svg-a11y';

export function SignOutIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M31 17V7a6 6 0 0 0-6-6H9a6 6 0 0 0-6 6v36a6 6 0 0 0 6 6h16a6 6 0 0 0 6-6V33m8 0 8-8m0 0-8-8m8 8H13" />
    </SvgA11y>
  );
}
