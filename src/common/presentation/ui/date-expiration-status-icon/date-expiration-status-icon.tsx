import { twMerge } from 'tailwind-merge';

import { useDateExpirationStatusIcon } from '@/ui/date-expiration-status-icon/use-date-expiration-status-icon';

type DateExpirationStatusIconProps = {
  date: string;
  label?: string;
  displayLabel?: boolean;
  className?: string;
};

export function DateExpirationStatusIcon({
  date,
  label,
  displayLabel = false,
  className,
}: DateExpirationStatusIconProps) {
  const { Icon, iconClassName, tooltip, statusLabel } =
    useDateExpirationStatusIcon({
      date,
      label,
    });

  return (
    <div
      className={twMerge('flex items-center justify-center', className)}
      title={tooltip}
    >
      {displayLabel && <span className="text-nowrap">{statusLabel}</span>}
      {/*
        A definite size rather than `h-full w-full`: the svg would otherwise
        resolve a percentage against a box this component does not control, so
        every caller had to hand it a height, and it collapsed to zero wherever
        that height was itself indefinite (Firefox does not resolve percentage
        heights against a table cell).
      */}
      <Icon className={`${iconClassName} size-10 shrink-0 stroke-2 p-2`} />
    </div>
  );
}
