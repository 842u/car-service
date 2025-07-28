import { SvgA11y, SvgA11yProps } from '../svg-a11y';

export function EyeOpenIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M1.12 26.27a2.42 2.42 0 0 1 0-1.53 25.17 25.17 0 0 1 47.75-.01c.17.5.17 1.03 0 1.53a25.16 25.16 0 0 1-47.75.01Z" />
      <path d="M32.19 25.5a7.19 7.19 0 1 1-14.38 0 7.19 7.19 0 0 1 14.38 0Z" />
    </SvgA11y>
  );
}
