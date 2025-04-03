import { ComponentProps, ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';

type IconButtonProps = {
  title: string;
  children: ReactElement<ComponentProps<'svg'>, 'svg'>;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export function IconButton({
  title,
  children,
  onClick,
  disabled,
  className,
}: IconButtonProps) {
  return (
    <button
      aria-label={title}
      className={twMerge(
        'border-accent-500 bg-accent-800 disabled:bg-accent-900 disabled:border-accent-700 h-12 cursor-pointer overflow-hidden rounded-lg border px-2 disabled:cursor-not-allowed',
        className,
      )}
      disabled={disabled}
      title={title}
      onClick={onClick}
    >
      {children}
      <span className="sr-only">{title}</span>
    </button>
  );
}
