import { twJoin } from 'tailwind-merge';

import { LinkButton } from '../LinkButton/LinkButton';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';
import { NavMenuItem } from './NavMenuItem';

type NavMenuProps = {
  isActive: boolean;
};

export function NavMenu({ isActive }: NavMenuProps) {
  return (
    <nav
      className={twJoin(
        'absolute left-0 top-0 flex h-screen w-screen justify-center bg-light-500 opacity-0 transition-all dark:bg-dark-500 lg:static lg:h-full lg:w-auto lg:translate-y-0 lg:items-center lg:justify-center lg:bg-[transparent] lg:text-xs lg:opacity-100 lg:dark:bg-[transparent]',
        isActive ? 'translate-y-0 opacity-100' : '-translate-y-full',
      )}
    >
      <ul className="relative flex w-4/5 flex-col items-center justify-center md:w-1/2 lg:flex-row-reverse lg:gap-3">
        <NavMenuItem>
          <div className="my-4 w-full lg:w-6">
            <ThemeSwitcher className="my-4 w-full" />
          </div>
        </NavMenuItem>
        <NavMenuItem>
          <LinkButton className="my-4" href="/dashboard">
            Dashboard
          </LinkButton>
        </NavMenuItem>
        <NavMenuItem>
          <p className="my-4 text-center">Placeholder</p>
        </NavMenuItem>
        <ul />
      </ul>
    </nav>
  );
}
