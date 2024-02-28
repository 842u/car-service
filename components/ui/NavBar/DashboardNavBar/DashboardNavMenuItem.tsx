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
    <li
      className={twJoin(
        'my-2 rounded-md @container md:overflow-hidden',
        isActive ? 'bg-alpha-grey-200' : '',
      )}
    >
      <Link className="flex items-center justify-start" href={href}>
        <svg
          className={twJoin(
            'm-2 aspect-square h-8 stroke-[10] md:flex-shrink-0',
            isActive ? 'stroke-accent-400' : 'stroke-alpha-grey-700',
          )}
        >
          {children}
        </svg>

        <span className="md:translate-x-0 md:opacity-0 md:transition-all md:@[64px]:translate-x-1 md:@[64px]:opacity-100">
          {text}
        </span>
      </Link>
    </li>
  );
}
