import { twJoin, twMerge } from 'tailwind-merge';

import { SignOutButton } from '@/auth/ui/buttons/sign-out/sign-out';
import { CarsIcon } from '@/icons/cars';
import { HomeIcon } from '@/icons/home';
import { UserIcon } from '@/icons/user';
import { ThemeButton } from '@/ui/theme-button/theme-button';

import { NavItem } from './item/item';

type NavBarNavProps = {
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
};

export function NavBarNav({
  onClick,
  className,
  isActive = true,
}: NavBarNavProps) {
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
        <NavItem href="/dashboard" text="Dashboard">
          <HomeIcon className="stroke-alpha-grey-900 dark:stroke-alpha-grey-800 item-active:stroke-dark-500 item-active:dark:stroke-light-500 h-full stroke-2 p-2" />
        </NavItem>
        <NavItem href="/dashboard/cars" text="Cars">
          <CarsIcon className="stroke-alpha-grey-900 dark:stroke-alpha-grey-800 item-active:stroke-dark-500 item-active:dark:stroke-light-500 h-full stroke-2 p-2" />
        </NavItem>
        <NavItem href="/dashboard/account" text="Account">
          <UserIcon className="stroke-alpha-grey-900 dark:stroke-alpha-grey-800 item-active:stroke-dark-500 item-active:dark:stroke-light-500 h-full stroke-2 p-2" />
        </NavItem>
      </ul>
      <ul className="before:bg-alpha-grey-300 w-full before:mx-auto before:block before:h-[1px] before:w-3/4">
        <li className="mx-2 my-4 h-12">
          <ThemeButton className="h-full w-full" />
        </li>
        <li className="mx-2 my-4 h-12">
          <SignOutButton className="h-full py-2" />
        </li>
      </ul>
    </nav>
  );
}
