import { CalendarIcon } from '@/icons/calendar';
import { EmptyStatePlaceholder } from '@/ui/empty-state-placeholder/empty-state-placeholder';

interface DateExpirationTablePlaceholderProps {
  label: string;
}

export function DateExpirationTablePlaceholder({
  label,
}: DateExpirationTablePlaceholderProps) {
  return (
    <EmptyStatePlaceholder
      icon={CalendarIcon}
      subtext={`You haven't added any ${label} dates. Once you do, they will  appear here.`}
      text={`No ${label} expiration data yet`}
    />
  );
}
