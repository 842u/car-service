import { twMerge } from 'tailwind-merge';

import type { NavMode } from '@/dashboard/ui/nav-mode/nav-mode';
import { CarsIcon } from '@/icons/cars';
import { HomeIcon } from '@/icons/home';
import { UserIcon } from '@/icons/user';
import { ThemeButton } from '@/ui/theme-button/theme-button';
import { SignOutButton } from '@/user/presentation/ui/buttons/sign-out/sign-out';

import { NavItem } from './item/item';
import { NavModeDropdown } from './mode-dropdown/mode-dropdown';

type NavBarNavProps = {
  navMode: NavMode;
  isActive?: boolean;
  onNavigate?: () => void;
  onClose?: () => void;
  className?: string;
  id?: string;
};

export function NavBarNav({
  navMode,
  onNavigate,
  onClose,
  className,
  isActive = true,
  id,
}: NavBarNavProps) {
  return (
    <nav
      aria-label="dashboard navigation menu"
      className={twMerge(
        // The transition names its properties instead of using `all` so that
        // `width` stays out of it. `width` is the resting width a mode sets,
        // and a mode change is a decision the user just made rather than
        // something to watch happen. The transient reveal widens the nav past
        // that resting width with `min-width`, which is in the list and so
        // animates.
        //
        // `md:min-w-16` restates the resting width and is not redundant: the
        // initial `min-width` is the keyword `auto`, and a keyword does not
        // interpolate with a length, so leaving it unset makes the reveal jump
        // instead of animating. Both ends of the transition have to be lengths.
        'border-alpha-grey-300 bg-light-500 dark:bg-dark-500 md:nav-auto:hover:min-w-56 md:nav-expanded:w-56 fixed top-0 left-0 flex h-screen w-56 flex-col border-r pt-16 transition-[background-color,border-color,min-width,translate,visibility] md:visible md:w-16 md:min-w-16 md:translate-x-0',
        isActive ? 'visible translate-x-0' : 'invisible -translate-x-full',
        className,
      )}
      id={id}
    >
      <button
        aria-label="close navigation menu"
        className="fixed -z-10 h-screen w-screen overflow-hidden md:hidden"
        type="button"
        onClick={onClose}
      />
      <ul className="grow">
        <NavItem href="/dashboard" text="Overview" onNavigate={onNavigate}>
          <HomeIcon className="stroke-alpha-grey-900 dark:stroke-alpha-grey-800 item-active:stroke-dark-500 item-active:dark:stroke-light-500 h-full stroke-2 p-2" />
        </NavItem>
        <NavItem href="/dashboard/cars" text="Cars" onNavigate={onNavigate}>
          <CarsIcon className="stroke-alpha-grey-900 dark:stroke-alpha-grey-800 item-active:stroke-dark-500 item-active:dark:stroke-light-500 h-full stroke-2 p-2" />
        </NavItem>
        <NavItem
          href="/dashboard/account"
          text="Account"
          onNavigate={onNavigate}
        >
          <UserIcon className="stroke-alpha-grey-900 dark:stroke-alpha-grey-800 item-active:stroke-dark-500 item-active:dark:stroke-light-500 h-full stroke-2 p-2" />
        </NavItem>
      </ul>
      <ul className="before:bg-alpha-grey-300 w-full before:mx-auto before:block before:h-px before:w-3/4">
        {/* Below `md` the nav is a transient drawer, where a resting width is
            not a thing the user can have an opinion about. */}
        <li className="mx-2 my-4 hidden h-12 md:block">
          <NavModeDropdown className="h-full w-full" navMode={navMode} />
        </li>
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
