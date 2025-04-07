import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export function ExclamationTriangleIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M25 14.57v17.8M1.75 38.6a5.62 5.62 0 0 0 4.87 8.43h36.74a5.62 5.62 0 0 0 4.87-8.43L29.87 6.77a5.62 5.62 0 0 0-9.74 0L1.76 38.6Zm22.71-2.72h1.06v1.02h-1.06v-1.02Z" />
    </SvgA11y>
  );
}
