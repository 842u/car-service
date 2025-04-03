import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export function SunIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 200 200"
    >
      <path d="M100 25v19m53 3-13 13m35 40h-19m-3 53-13-13m-40 16v19m-40-35-13 13m-3-53H25m35-40L47 47m84 53a31 31 0 1 1-62 0 31 31 0 0 1 62 0Z" />
    </SvgA11y>
  );
}
