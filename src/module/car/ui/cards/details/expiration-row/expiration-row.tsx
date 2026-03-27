import { DateExpirationStatusIcon } from '@/ui/date-expiration-status-icon/date-expiration-status-icon';
import type { SvgA11yProps } from '@/ui/decorative/svg-a11y/svg-a11y';

interface DetailsCardExpirationRowProps {
  label: string;
  date?: string | null;
  icon?: React.ComponentType<SvgA11yProps>;
}

export function DetailsCardExpirationRow({
  label,
  date,
  icon,
}: DetailsCardExpirationRowProps) {
  const formatted =
    date &&
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const Icon = icon;

  return (
    <div className="flex items-center gap-3">
      {Icon && (
        <Icon className="md:dark:stroke-accent-400/40 md:stroke-accent-500/50 hidden md:block md:h-8 md:w-8 md:shrink-0 md:stroke-2" />
      )}
      <div>
        <p className="text-alpha-grey-900 text-[10px]">
          {label.toUpperCase()} EXPIRATION
        </p>
        <p className="overflow-auto">
          {formatted ?? <span className="text-alpha-grey-900">---</span>}
        </p>
      </div>
      {date && (
        <DateExpirationStatusIcon
          displayLabel
          className="ml-auto h-10 shrink-0 p-0.5 text-xs"
          date={date}
          label={label}
        />
      )}
    </div>
  );
}
