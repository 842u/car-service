import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function TransmissionIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M25.5 37a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 0V25.5m0-11.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 0v11.5M12.5 37a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 0V25.5m0-11.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 0v11.5m0 0h13m0 0h12a1 1 0 0 0 1-1V14m0 0a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" />
    </SvgA11y>
  );
}
