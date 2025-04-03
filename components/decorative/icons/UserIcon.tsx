import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export const USER_ICON_TEST_ID = 'user icon';

export function UserIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      data-testid={USER_ICON_TEST_ID}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 200 200"
    >
      <path d="M131.2 50a31.2 31.2 0 1 1-62.4 0 31.2 31.2 0 0 1 62.4 0Zm-32 130.3c-21.4.1-42.5-4.4-62-13.1a62 62 0 0 1 124 0 149.5 149.5 0 0 1-62 13.1Z" />
    </SvgA11y>
  );
}
