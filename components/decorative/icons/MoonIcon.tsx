import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export function MoonIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M45.3 31.3a20.3 20.3 0 0 1-28.1-18.8c0-2.8.5-5.4 1.5-7.8a20.3 20.3 0 1 0 26.6 26.6Z" />
    </SvgA11y>
  );
}
