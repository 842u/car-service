import { useDateExpirationStatusIcon } from '@/ui/date-expiration-status-icon/use-date-expiration-status-icon';

interface DateExpirationStatusIconProps {
  date: string;
  label?: string;
  className?: string;
}

export function DateExpirationStatusIcon({
  date,
  label,
  className,
}: DateExpirationStatusIconProps) {
  const { Icon, iconClassName, tooltip } = useDateExpirationStatusIcon({
    date,
    label,
  });

  return (
    <div className={className} title={tooltip}>
      <Icon className={`${iconClassName} h-full stroke-2 p-2`} />
    </div>
  );
}
