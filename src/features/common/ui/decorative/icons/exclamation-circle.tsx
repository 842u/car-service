import { SvgA11y, SvgA11yProps } from '../svg-a11y/svg-a11y';

export function ExclamationCircleIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M25 14.33v17.8m24-6.63a24 24 0 1 1-48 0 24 24 0 0 1 48 0ZM24.47 35.65h1.06v1.02h-1.06v-1.02Z" />
    </SvgA11y>
  );
}
