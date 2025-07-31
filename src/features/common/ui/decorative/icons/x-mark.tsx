import { SvgA11y, SvgA11yProps } from '../svg-a11y/svg-a11y';

export function XMarkIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M1 49 49 1M1 1l48 48" />
    </SvgA11y>
  );
}
