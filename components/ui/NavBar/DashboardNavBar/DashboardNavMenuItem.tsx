import { Route } from 'next';
import Link from 'next/link';
import { usePathname, useSelectedLayoutSegment } from 'next/navigation';
import { twJoin } from 'tailwind-merge';

type DashboardNavMenuItemProps = {
  href: Route;
  text: string;
  prefetch?: boolean;
  children?: JSX.Element;
};

export function DashboardNavMenuItem({
  href,
  text,
  prefetch = true,
  children,
}: DashboardNavMenuItemProps) {
  const pathname = usePathname();
  const segment = useSelectedLayoutSegment();
  const isActive =
    pathname === href || (pathname.startsWith(href) && href !== `/${segment}`);

  return (
    <li
      className={twJoin(
        'group m-2 rounded-md hover:bg-alpha-grey-100 md:overflow-hidden md:transition-colors md:@container',
        isActive ? 'bg-alpha-grey-200 hover:bg-alpha-grey-200' : '',
      )}
    >
      <Link
        className="flex items-center justify-start"
        href={href}
        prefetch={prefetch}
      >
        <div
          className={twJoin(
            'm-2 aspect-square h-8 stroke-[10] md:flex-shrink-0 md:transition-colors',
            isActive
              ? 'stroke-accent-400'
              : 'stroke-alpha-grey-700 group-hover:stroke-alpha-grey-900',
          )}
        >
          {children}
        </div>

        <span
          className={twJoin(
            'whitespace-nowrap md:translate-x-0 md:opacity-0 md:transition-all md:@[64px]:translate-x-1 md:@[64px]:opacity-100',
            isActive
              ? ''
              : 'text-alpha-grey-700 group-hover:text-alpha-grey-900',
          )}
        >
          {text}
        </span>
      </Link>
    </li>
  );
}
