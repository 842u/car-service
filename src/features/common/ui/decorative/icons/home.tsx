import { SvgA11y, SvgA11yProps } from '../svg-a11y/svg-a11y';

export function HomeIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M1 25.35 23.04 3.31a2.77 2.77 0 0 1 3.92 0L49 25.35M6.54 19.81v24.92A2.77 2.77 0 0 0 9.3 47.5h10.15v-12a2.77 2.77 0 0 1 2.77-2.77h5.54a2.77 2.77 0 0 1 2.77 2.77v12h10.15a2.77 2.77 0 0 0 2.77-2.77V19.81m-27.7 27.7h20.32" />
    </SvgA11y>
  );
}
