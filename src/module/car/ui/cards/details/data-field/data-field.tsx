interface DetailsCardDataFieldProps {
  label: string;
  value?: string | number | null;
}

export function DetailsCardDataField({
  label,
  value,
}: DetailsCardDataFieldProps) {
  return (
    <div className="max-w-1/2 min-w-1/3 text-nowrap even:text-right">
      <p className="text-alpha-grey-900 text-[10px]">{label}</p>
      <p className="overflow-auto">{value ?? '---'}</p>
    </div>
  );
}
