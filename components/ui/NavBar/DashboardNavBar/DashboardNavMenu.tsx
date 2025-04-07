import { twJoin, twMerge } from 'tailwind-merge';

import { CarsIcon } from '@/components/decorative/icons/CarsIcon';
import { HomeIcon } from '@/components/decorative/icons/HomeIcon';
import { SignOutIcon } from '@/components/decorative/icons/SignOutIcon';
import { UserIcon } from '@/components/decorative/icons/UserIcon';

import { ThemeButton } from '../../ThemeButton/ThemeButton';
import { DashboardNavMenuItem } from './DashboardNavMenuItem';

type DashboardNavMenuProps = {
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
};

export function DashboardNavMenu({
  onClick,
  className,
  isActive = true,
}: DashboardNavMenuProps) {
  return (
    <nav
      aria-label="dashboard navigation menu"
      className={twMerge(
        'border-alpha-grey-300 bg-light-500 dark:bg-dark-500 fixed top-0 left-0 flex h-screen w-56 flex-col border-r pt-16 transition-all md:w-16 md:translate-x-0 md:hover:w-56',
        isActive ? 'translate-x-0' : '-translate-x-full',
        className,
      )}
      onClick={onClick}
    >
      <div
        // Artificial area to register click event
        aria-hidden
        className={twJoin(
          'fixed -z-10 h-screen w-screen overflow-hidden md:hidden',
          isActive ? 'translate-x-0' : '-translate-x-full',
        )}
      />
      <ul className="grow">
        <DashboardNavMenuItem href="/dashboard" text="Dashboard">
          <HomeIcon className="stroke-alpha-grey-800 dark:stroke-alpha-grey-700 item-active:stroke-dark-500 item-active:dark:stroke-light-500" />
        </DashboardNavMenuItem>
        <DashboardNavMenuItem href="/dashboard/cars" text="Cars">
          <CarsIcon className="stroke-alpha-grey-800 dark:stroke-alpha-grey-700 item-active:stroke-dark-500 item-active:dark:stroke-light-500" />
        </DashboardNavMenuItem>
        <DashboardNavMenuItem href="/dashboard/account" text="Account">
          <UserIcon className="stroke-alpha-grey-800 dark:stroke-alpha-grey-700 item-active:stroke-dark-500 item-active:dark:stroke-light-500" />
        </DashboardNavMenuItem>
      </ul>
      <ul className="before:bg-alpha-grey-300 w-full before:mx-auto before:block before:h-[1px] before:w-3/4">
        <li className="m-2 py-0">
          <ThemeButton className="h-10 w-full px-2 py-1" />
        </li>
        <DashboardNavMenuItem
          href="/api/auth/sign-out"
          prefetch={false}
          text="Sign out"
        >
          <SignOutIcon />
        </DashboardNavMenuItem>
      </ul>
    </nav>
  );
}
