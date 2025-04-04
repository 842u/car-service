import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export function MailIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M21.8 6.8v10.4a2.3 2.3 0 0 1-2.3 2.3h-15a2.3 2.3 0 0 1-2.3-2.3V6.8m19.6 0a2.3 2.3 0 0 0-2.3-2.3h-15a2.3 2.3 0 0 0-2.3 2.3m19.6 0V7a2.3 2.3 0 0 1-1.1 2l-7.5 4.5a2.3 2.3 0 0 1-2.4 0L3.3 9a2.3 2.3 0 0 1-1-2v-.2" />
    </SvgA11y>
  );
}
