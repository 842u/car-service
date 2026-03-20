import { CalendarIcon } from '@/icons/calendar';

interface DateExpirationTablePlaceholderProps {
  label: string;
}

export function DateExpirationTablePlaceholder({
  label,
}: DateExpirationTablePlaceholderProps) {
  return (
    <div className="border-alpha-grey-500 flex h-full flex-col items-center justify-center gap-4 rounded-md border border-dashed p-10 text-center">
      <div className="bg-accent-100 dark:bg-accent-900/70 flex h-12 w-12 items-center justify-center rounded-lg">
        <CalendarIcon className="stroke-accent-500 stroke-[1.5] p-2" />
      </div>

      <div>
        <p className="text-base font-medium">No expiration data yet</p>
        <p className="text-alpha-grey-900 text-sm">
          You haven&apos;t added any {label} dates. Once you do, they will
          appear here.
        </p>
      </div>
    </div>
  );
}
