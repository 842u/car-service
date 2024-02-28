import { twJoin, twMerge } from 'tailwind-merge';

import { CarsIcon } from '@/components/decorative/icons/CarsIcon';
import { GarageIcon } from '@/components/decorative/icons/GarageIcon';

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
        'absolute left-0 top-0 z-50 h-screen w-56 border-r border-alpha-grey-300 bg-light-500 pt-16 transition-all dark:bg-dark-500 md:w-16 md:translate-x-0 md:hover:w-56',
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
      <ul className="h-full px-2">
        <DashboardNavMenuItem href="/dashboard" text="Dashboard">
          <GarageIcon />
        </DashboardNavMenuItem>
        <DashboardNavMenuItem href="/dashboard/cars" text="Cars">
          <CarsIcon />
        </DashboardNavMenuItem>
      </ul>
    </nav>
  );
}
