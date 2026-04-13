import type { ComponentType, SVGProps } from 'react';
import { twMerge } from 'tailwind-merge';

interface EmptyStatePlaceholderProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  text: string;
  subtext?: string;
  className?: string;
}

export function EmptyStatePlaceholder({
  icon: Icon,
  text,
  subtext,
  className = '',
}: EmptyStatePlaceholderProps) {
  return (
    <div
      className={twMerge(
        'border-alpha-grey-500 flex h-full flex-col items-center justify-center gap-4 rounded-md border border-dashed p-10 text-center',
        className,
      )}
    >
      <div className="bg-accent-100 dark:bg-accent-900/70 flex h-12 w-12 items-center justify-center rounded-lg">
        <Icon className="stroke-accent-500 stroke-3 p-3" />
      </div>

      <div>
        <p className="text-base font-medium">{text}</p>
        {subtext && <p className="text-alpha-grey-900 text-sm">{subtext}</p>}
      </div>
    </div>
  );
}
