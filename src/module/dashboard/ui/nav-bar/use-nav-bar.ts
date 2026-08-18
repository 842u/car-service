import { useId, useState } from 'react';

import { useSessionUser } from '@/user/presentation/hook/use-session-user';

export function useDashboardNavBar() {
  const { data: user, isPending } = useSessionUser();

  // The nav is a drawer below `md` and a permanent rail above it. This state is
  // the drawer's, and the id is what ties it to the button that opens it.
  const navId = useId();
  const [isActive, setIsActive] = useState(false);

  const handleHamburgerButtonClick = () => {
    setIsActive((currentState) => !currentState);
  };

  const handleNavClick = () => {
    if (isActive) {
      setIsActive(false);
    }
  };

  return {
    user,
    isPending,
    navId,
    isActive,
    handleHamburgerButtonClick,
    handleNavClick,
  };
}
