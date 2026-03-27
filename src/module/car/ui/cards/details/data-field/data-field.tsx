import type { SvgA11yProps } from '@/ui/decorative/svg-a11y/svg-a11y';

interface DetailsCardDataFieldProps {
  label: string;
  value?: string | number | null;
  icon?: React.ComponentType<SvgA11yProps>;
}

export function DetailsCardDataField({
  label,
  value,
  icon,
}: DetailsCardDataFieldProps) {
  const Icon = icon;

  return (
    <div className="max-w-1/2 min-w-1/3 text-nowrap even:text-right md:max-w-max md:even:text-start">
      <p className="text-alpha-grey-900 text-[10px] md:mb-1 md:text-xs">
        {label}
      </p>
      <div className="md:flex md:items-center md:gap-2">
        {Icon && (
          <Icon className="md:dark:stroke-accent-400/40 md:stroke-accent-500/50 hidden md:block md:h-7 md:w-7 md:shrink-0 md:stroke-3 md:p-0.5" />
        )}
        <p className="overflow-auto">
          {value ?? <span className="text-alpha-grey-900">---</span>}
        </p>
      </div>
    </div>
  );
}
