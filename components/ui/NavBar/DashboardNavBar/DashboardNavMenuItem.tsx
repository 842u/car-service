import { Route } from 'next';
import { usePathname, useSelectedLayoutSegment } from 'next/navigation';
import { JSX } from 'react';
import { twMerge } from 'tailwind-merge';

import { LinkButton } from '../../LinkButton/LinkButton';

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
      className={twMerge(
        'm-2 rounded-md md:@container md:overflow-hidden',
        isActive ? 'item-active' : '',
      )}
    >
      <LinkButton
        className="item-active:bg-alpha-grey-200 item-active:hover:bg-alpha-grey-300 flex items-center justify-start gap-2 px-2 py-1"
        href={href}
        prefetch={prefetch}
        variant="transparent"
      >
        <div className="aspect-square h-full stroke-2 md:shrink-0">
          {children}
        </div>
        <span className="text-alpha-grey-800 dark:text-alpha-grey-700 item-active:text-dark-500 item-active:dark:text-light-500 whitespace-nowrap transition-all md:translate-x-0 md:opacity-0 md:@[64px]:translate-x-1 md:@[64px]:opacity-100">
          {text}
        </span>
      </LinkButton>
    </li>
  );
}
