import { twJoin, twMerge } from 'tailwind-merge';

import { CarsIcon } from '@/components/decorative/icons/CarsIcon';
import { HomeIcon } from '@/components/decorative/icons/HomeIcon';
import { UserIcon } from '@/components/decorative/icons/UserIcon';

import { SignOutLink } from '../../SignOutLink/SignOutLink';
import { ThemeSwitcher } from '../../ThemeSwitcher/ThemeSwitcher';
import { DashboardNavMenuBottomItem } from './DashboardNavMenuBottomItem';
import { DashboardNavMenuItem } from './DashboardNavMenuItem';

type DashboardNavMenuProps = {
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
};

export function DashboardNavMenu({
  isActive = true,
  onClick,
  className = '',
}: DashboardNavMenuProps) {
  return (
    // eslint-disable-next-line
    <nav
      aria-label="dashboard navigation menu"
      className={twMerge(
        'fixed left-0 top-0 z-50 flex h-screen w-56 flex-col border-r border-alpha-grey-300 bg-light-500 pt-16 transition-all dark:bg-dark-500 md:w-16 md:translate-x-0 md:hover:w-56',
        isActive ? 'translate-x-0' : '-translate-x-full',
        className,
      )}
      onClick={onClick}
    >
      <div
        aria-hidden
        className={twJoin(
          'fixed -z-10 h-screen w-screen overflow-hidden md:hidden',
          isActive ? 'translate-x-0' : '-translate-x-full',
        )}
      />
      <ul className="flex-grow">
        <DashboardNavMenuItem href="/dashboard" text="Dashboard">
          <HomeIcon />
        </DashboardNavMenuItem>
        <DashboardNavMenuItem href="/dashboard/cars" text="Cars">
          <CarsIcon />
        </DashboardNavMenuItem>
        <DashboardNavMenuItem href="/dashboard/account" text="Account">
          <UserIcon />
        </DashboardNavMenuItem>
      </ul>
      <ul className="w-full before:mx-auto before:block before:h-[1px] before:w-3/4 before:bg-alpha-grey-300">
        <DashboardNavMenuBottomItem>
          <div className="h-8 w-full">
            <ThemeSwitcher className="h-full w-full" />
          </div>
        </DashboardNavMenuBottomItem>
        <DashboardNavMenuBottomItem>
          <SignOutLink />
        </DashboardNavMenuBottomItem>
      </ul>
    </nav>
  );
}
