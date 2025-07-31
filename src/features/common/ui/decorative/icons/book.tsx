import { SvgA11y, SvgA11yProps } from '../svg-a11y/svg-a11y';

export function BookIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M25 9.56A23.91 23.91 0 0 0 1 4.8v38a23.91 23.91 0 0 1 24 4.75m0-38A23.9 23.9 0 0 1 49 4.8v38a23.91 23.91 0 0 0-24 4.75m0-38v38" />
    </SvgA11y>
  );
}
