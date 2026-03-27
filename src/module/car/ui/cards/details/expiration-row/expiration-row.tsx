import { DateExpirationStatusIcon } from '@/ui/date-expiration-status-icon/date-expiration-status-icon';

interface DetailsCardExpirationRowProps {
  label: string;
  date?: string | null;
}

export function DetailsCardExpirationRow({
  label,
  date,
}: DetailsCardExpirationRowProps) {
  const formatted =
    date &&
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-alpha-grey-900 text-[10px]">
          {label.toUpperCase()} EXPIRATION
        </p>
        <p className="overflow-auto">{formatted}</p>
      </div>
      {date && (
        <DateExpirationStatusIcon
          displayLabel
          className="h-10 p-0.5 text-xs"
          date={date}
          label={label}
        />
      )}
    </div>
  );
}
