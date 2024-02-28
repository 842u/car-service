import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { twJoin, twMerge } from 'tailwind-merge';

import { CarsIcon } from '@/components/decorative/icons/CarsIcon';
import { GarageIcon } from '@/components/decorative/icons/GarageIcon';

import { ThemeSwitcher } from '../../ThemeSwitcher/ThemeSwitcher';
import { DashboardNavMenuItem } from './DashboardNavMenuItem';

type DashboardNavMenuProps = {
  isActive: boolean;
  onClick: () => void;
  className?: string;
};

export function DashboardNavMenu({
  isActive,
  onClick,
  className,
}: DashboardNavMenuProps) {
  return (
    // eslint-disable-next-line
    <nav
      className={twMerge(
        'absolute left-0 top-0 z-50 flex h-screen w-56 flex-col border-r border-alpha-grey-300 bg-light-500 pt-16 transition-all dark:bg-dark-500 md:w-16 md:translate-x-0 md:hover:w-56',
        isActive ? 'translate-x-0' : '-translate-x-full',
        className,
      )}
      onClick={onClick}
    >
      <div
        aria-hidden
        className={twJoin(
          'absolute -z-10 h-screen w-screen overflow-hidden md:hidden',
          isActive ? 'translate-x-0' : '-translate-x-full',
        )}
      />
      <ul className="flex-grow">
        <DashboardNavMenuItem href="/dashboard" text="Dashboard">
          <GarageIcon />
        </DashboardNavMenuItem>
        <DashboardNavMenuItem href="/dashboard/cars" text="Cars">
          <CarsIcon />
        </DashboardNavMenuItem>
      </ul>
      <ul className="relative w-full before:mx-auto before:block before:h-[1px] before:w-3/4 before:bg-alpha-grey-300">
        <li className="group m-2 rounded-md py-2 hover:bg-alpha-grey-100 md:overflow-hidden md:transition-colors md:@container">
          <div className="h-8 w-full">
            <ThemeSwitcher className="h-full w-full" />
          </div>
        </li>
        <DashboardNavMenuItem href="/api/auth/sign-out" text="Sign Out">
          <ArrowLeftStartOnRectangleIcon />
        </DashboardNavMenuItem>
      </ul>
    </nav>
  );
}
