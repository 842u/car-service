import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export function PencilIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="m36.97 7 4.15-4.15a4.62 4.62 0 0 1 6.53 6.53L12.28 44.75c-1.3 1.3-2.9 2.26-4.67 2.78L1 49.5l1.97-6.6a11.08 11.08 0 0 1 2.78-4.68L36.97 7.01h0Zm0 0 6.5 6.5" />
    </SvgA11y>
  );
}
