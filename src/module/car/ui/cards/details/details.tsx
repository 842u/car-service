import { DetailsCardDataField } from '@/car/ui/cards/details/data-field/data-field';
import { DetailsCardExpirationRow } from '@/car/ui/cards/details/expiration-row/expiration-row';
import { DetailsCardHeader } from '@/car/ui/cards/details/header/header';
import type { Car } from '@/types';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';

const DATA_FIELDS: { label: string; key: keyof Car }[] = [
  { label: 'FUEL TYPE', key: 'fuel_type' },
  { label: 'ADDITIONAL FUEL', key: 'additional_fuel_type' },
  { label: 'YEAR', key: 'production_year' },
  { label: 'VIN', key: 'vin' },
  { label: 'DRIVE TYPE', key: 'drive_type' },
  { label: 'ENGINE CAPACITY', key: 'engine_capacity' },
  { label: 'MILEAGE', key: 'mileage' },
  { label: 'TRANSMISSION', key: 'transmission_type' },
];

interface DetailsCardProps {
  data?: Car;
  className?: string;
}

export function DetailsCard({ data, className }: DetailsCardProps) {
  return (
    <div className={className}>
      <DetailsCardHeader data={data} />

      <TextSeparator
        className="text-alpha-grey-500 my-10 text-xs"
        text="TECHNICAL SPECIFICATIONS"
      />

      <div className="my-5 flex flex-wrap justify-between gap-5">
        {DATA_FIELDS.map(({ label, key }) => (
          <DetailsCardDataField key={key} label={label} value={data?.[key]} />
        ))}
      </div>

      <TextSeparator
        className="text-alpha-grey-500 my-10 text-xs"
        text="LEGAL & COMPLIANCE"
      />

      <div className="flex flex-col gap-5">
        <DetailsCardExpirationRow
          date={data?.insurance_expiration}
          label="Insurance"
        />
        <DetailsCardExpirationRow
          date={data?.technical_inspection_expiration}
          label="Technical inspection"
        />
      </div>
    </div>
  );
}
