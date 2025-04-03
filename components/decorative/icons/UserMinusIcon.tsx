import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export function UserMinusIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M22 10.5h-6m-2.3-4.1a3.4 3.4 0 1 1-6.7 0 3.4 3.4 0 0 1 6.8 0ZM4 19.2v0a6.4 6.4 0 0 1 12.8 0v0a12.3 12.3 0 0 1-6.4 1.8C8 21 5.9 20.4 4 19.2Z" />
    </SvgA11y>
  );
}
