import { twJoin, twMerge } from 'tailwind-merge';

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
        'absolute left-0 top-0 z-50 h-screen w-3/5 border-r border-alpha-grey-300 bg-light-500 pt-16 transition-all dark:bg-dark-500 md:w-16 md:translate-x-0',
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
      <ul>
        <li>cars</li>
        <li>account</li>
        <li>settings</li>
      </ul>
    </nav>
  );
}
