import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export function ExclamationCircleIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 200 200"
    >
      <path d="M100 75v31m75-6a75 75 0 1 1-150 0 75 75 0 0 1 150 0Zm-75 31h0v0h0v0Z" />
    </SvgA11y>
  );
}
