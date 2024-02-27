import { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twJoin } from 'tailwind-merge';

type DashboardNavMenuItemProps = {
  href: Route;
  text: string;
  children?: JSX.Element;
};
export function DashboardNavMenuItem({
  href,
  text,
  children,
}: DashboardNavMenuItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      className={twJoin(
        'flex items-center rounded-md',
        isActive ? 'bg-alpha-grey-200' : '',
      )}
      href={href}
    >
      <svg
        className={twJoin(
          'm-2 aspect-square h-8 stroke-[10] md:w-full',
          isActive ? 'stroke-accent-400' : 'stroke-alpha-grey-700',
        )}
      >
        {children}
      </svg>

      <span className="my-2 md:hidden">{text}</span>
    </Link>
  );
}
