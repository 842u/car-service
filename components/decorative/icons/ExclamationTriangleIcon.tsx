import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export function ExclamationTriangleIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 200 200"
    >
      <path d="M100 84v32m-78 28c-7 12 2 28 17 28h122c15 0 24-16 17-28L116 38c-7-13-25-13-32 0L22 144Zm78-3h0v0h0v0Z" />
    </SvgA11y>
  );
}
