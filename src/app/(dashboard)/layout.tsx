import { cookies } from 'next/headers';
import type { ReactNode } from 'react';

import { DashboardNavBar } from '@/dashboard/ui/nav-bar/nav-bar';
import {
  NAV_MODE_COOKIE_NAME,
  parseNavMode,
} from '@/dashboard/ui/nav-mode/nav-mode';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const navMode = parseNavMode(cookieStore.get(NAV_MODE_COOKIE_NAME)?.value);

  return (
    // All three modes are CSS keyed off this attribute, so it has to sit above
    // both the nav and the page's main region. Resolving it on the server is
    // what keeps the first frame right: getting it wrong for a frame would
    // shift the whole dashboard sideways by the difference between the nav's
    // two widths.
    <div data-nav-mode={navMode}>
      <DashboardNavBar navMode={navMode} />
      {children}
    </div>
  );
}
