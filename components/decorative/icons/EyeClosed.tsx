import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export function EyeClosedIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 200 200"
    >
      <path d="M33 69c-8 9-13 19-17 31a88 88 0 0 0 108 59M52 52c14-10 31-15 48-14 40 0 73 26 84 62-6 20-19 37-36 48M52 52 25 25m27 27 30 30m66 66 27 27m-27-27-30-30a25 25 0 1 0-36-36m36 36L82 82" />
    </SvgA11y>
  );
}
