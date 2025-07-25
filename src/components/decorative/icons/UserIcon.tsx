import { SvgA11y, SvgA11yProps } from '../SvgA11y';

export const USER_ICON_TEST_ID = 'user icon';

export function UserIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      data-testid={USER_ICON_TEST_ID}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M34.6 10.35a9.35 9.35 0 1 1-18.7 0 9.35 9.35 0 0 1 18.7 0ZM6.54 45.06a18.46 18.46 0 0 1 36.92 0A44.3 44.3 0 0 1 25 49a44.3 44.3 0 0 1-18.46-3.94Z" />
    </SvgA11y>
  );
}
