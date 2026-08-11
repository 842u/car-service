'use client';

import { useTheme } from 'next-themes';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';

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
      className={className}
      size="icon"
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
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
