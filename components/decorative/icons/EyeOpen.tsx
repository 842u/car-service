import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export function EyeOpenIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 200 200"
    >
      <path d="M17 103v-6a88 88 0 0 1 166 0v6a87 87 0 0 1-166 0Z" />
      <path d="M125 100a25 25 0 1 1-50 0 25 25 0 0 1 50 0Z" />
    </SvgA11y>
  );
}
