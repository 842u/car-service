import { Route } from 'next';
import { usePathname, useSelectedLayoutSegment } from 'next/navigation';
import { JSX } from 'react';
import { twMerge } from 'tailwind-merge';

import { LinkButton } from '../../../common/ui/link-button/link-button';

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
    <li>
      <LinkButton
        className={twMerge(
          'm-2 flex h-12 items-center justify-start gap-2 rounded-md p-0 md:@container md:overflow-hidden',
          isActive && 'item-active bg-alpha-grey-200 hover:bg-alpha-grey-300',
        )}
        href={href}
        prefetch={prefetch}
        variant="transparent"
      >
        <div className="h-full md:shrink-0">{children}</div>
        <span className="text-alpha-grey-900 dark:text-alpha-grey-800 item-active:text-dark-500 item-active:dark:text-light-500 whitespace-nowrap transition-all md:translate-x-0 md:opacity-0 md:@[64px]:translate-x-1 md:@[64px]:opacity-100">
          {text}
        </span>
      </LinkButton>
    </li>
  );
}
