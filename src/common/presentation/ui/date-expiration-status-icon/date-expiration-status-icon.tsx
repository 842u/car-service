import { twMerge } from 'tailwind-merge';

import { useDateExpirationStatusIcon } from '@/ui/date-expiration-status-icon/use-date-expiration-status-icon';

interface DateExpirationStatusIconProps {
  date: string;
  label?: string;
  displayLabel?: boolean;
  className?: string;
}

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
      <Icon className={`${iconClassName} h-full w-full stroke-2 p-2`} />
    </div>
  );
}
