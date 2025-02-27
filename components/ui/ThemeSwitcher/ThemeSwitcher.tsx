'use client';

import { useTheme } from 'next-themes';
import { ComponentProps, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { MoonIcon } from '@/components/decorative/icons/MoonIcon';
import { SunIcon } from '@/components/decorative/icons/SunIcon';

type ThemeSwitcherProps = ComponentProps<'button'> & {
  className?: string;
};

export function ThemeSwitcher({ className, ...props }: ThemeSwitcherProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      aria-label="switch color theme"
      className={twMerge('block aspect-square h-6 cursor-pointer', className)}
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      {...props}
    >
      {resolvedTheme === 'dark' ? (
        <SunIcon
          className="stroke-light-500 h-full w-full stroke-10"
          data-testid="light-theme-icon"
        />
      ) : (
        <MoonIcon
          className="stroke-dark-500 h-full w-full stroke-10"
          data-testid="dark-theme-icon"
        />
      )}
    </button>
  );
}
