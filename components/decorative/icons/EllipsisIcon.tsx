import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export function EllipsisIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M1 25a4.8 4.8 0 1 1 9.6 0A4.8 4.8 0 0 1 1 25Zm19.2 0a4.8 4.8 0 1 1 9.6 0 4.8 4.8 0 0 1-9.6 0Zm19.2 0a4.8 4.8 0 1 1 9.6 0 4.8 4.8 0 0 1-9.6 0Z" />
    </SvgA11y>
  );
}
