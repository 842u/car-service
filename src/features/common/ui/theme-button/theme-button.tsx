'use client';

import { useTheme } from 'next-themes';
import { ComponentProps, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { MoonIcon } from '@/icons/moon';
import { SunIcon } from '@/icons/sun';
import { IconButton } from '@/ui/icon-button/icon-button';

type ThemeButtonProps = ComponentProps<'button'> & {
  className?: string;
};

export function ThemeButton({ className, ...props }: ThemeButtonProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <IconButton
      className={twMerge('aspect-square p-2', className)}
      title="switch color theme"
      variant="transparent"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      {...props}
    >
      {resolvedTheme === 'dark' ? (
        <SunIcon
          className="stroke-light-500 h-full w-full stroke-3"
          data-testid="light-theme-icon"
        />
      ) : (
        <MoonIcon
          className="stroke-dark-500 h-full w-full stroke-2"
          data-testid="dark-theme-icon"
        />
      )}
    </IconButton>
  );
}
