'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import { ComponentProps, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

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
      className={twMerge('block', className)}
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      {...props}
    >
      {resolvedTheme === 'dark' ? (
        <SunIcon
          className="mx-auto h-6 w-6 transition-opacity"
          data-testid="light-theme-icon"
        />
      ) : (
        <MoonIcon
          className="mx-auto h-6 w-6 transition-opacity"
          data-testid="dark-theme-icon"
        />
      )}
    </button>
  );
}
