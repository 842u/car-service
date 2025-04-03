import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export function KeyIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M15.8 5.3a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7 5.9c-.6-.1-1.2 0-1.6.4l-2.7 2.7H8.2v2.2H6v2.3H2.2v-2.9c0-.6.3-1.1.7-1.6l6.5-6.5c.4-.4.5-1 .4-1.5a6 6 0 1 1 12-1Z" />
    </SvgA11y>
  );
}
