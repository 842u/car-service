import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export function SunIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M25 6.3v4.6m13.3.8-3.4 3.4m8.9 9.9H39m-.8 13.3-3.4-3.4M25 39.1v4.6M15 35l-3.3 3.4M11 25H6.2m8.9-10-3.4-3.3M32.8 25a7.8 7.8 0 1 1-15.6 0 7.8 7.8 0 0 1 15.6 0Z" />
    </SvgA11y>
  );
}
