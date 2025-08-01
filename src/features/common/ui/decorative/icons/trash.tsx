import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function TrashIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="m31.74 18.12-.85 22.15m-11.78 0-.85-22.15m24.53-7.9c.84.12 1.68.26 2.52.4m-2.52-.4-2.63 34.17a5.54 5.54 0 0 1-5.52 5.11H15.36a5.54 5.54 0 0 1-5.52-5.11L7.2 10.2m35.58 0c-2.84-.42-5.7-.75-8.56-.97M7.2 10.2l-2.52.41m2.52-.4c2.84-.43 5.7-.76 8.56-.98m18.46 0V6.98c0-2.9-2.24-5.32-5.14-5.41-2.73-.1-5.45-.1-8.18 0a5.36 5.36 0 0 0-5.14 5.41v2.26m18.46 0a119.8 119.8 0 0 0-18.46 0" />
    </SvgA11y>
  );
}
