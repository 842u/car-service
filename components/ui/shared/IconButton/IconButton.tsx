import {
  ComponentProps,
  ComponentPropsWithRef,
  MouseEventHandler,
  ReactElement,
} from 'react';
import { twMerge } from 'tailwind-merge';

import { ButtonVariants } from '@/types';
import { buttonVariants } from '@/utils/tailwindcss/button';

type IconButtonProps = ComponentPropsWithRef<'button'> & {
  title: string;
  children: ReactElement<ComponentProps<'svg'>, 'svg'>;
  variant?: ButtonVariants;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
};

export function IconButton({
  title,
  children,
  onClick,
  variant = 'default',
  disabled,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={title}
      className={twMerge(
        buttonVariants[variant],
        'overflow-hidden px-3 py-1',
        className,
      )}
      disabled={disabled}
      title={title}
      type="button"
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
