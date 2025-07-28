import { SvgA11y, SvgA11yProps } from '../svg-a11y';

export function MailIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M49 12.08v25.84a5.54 5.54 0 0 1-5.54 5.54H6.54A5.54 5.54 0 0 1 1 37.92V12.08m48 0a5.54 5.54 0 0 0-5.54-5.54H6.54A5.54 5.54 0 0 0 1 12.08m48 0v.6a5.54 5.54 0 0 1-2.63 4.71L27.9 28.75a5.54 5.54 0 0 1-5.8 0L3.63 17.4A5.54 5.54 0 0 1 1 12.68v-.6" />
    </SvgA11y>
  );
}
