import { DetailsCardDataField } from '@/car/ui/cards/details/data-field/data-field';
import { DetailsCardExpirationRow } from '@/car/ui/cards/details/expiration-row/expiration-row';
import { DetailsCardHeader } from '@/car/ui/cards/details/header/header';
import { CalendarIcon } from '@/icons/calendar';
import { CheckShieldIcon } from '@/icons/check-shield';
import { DriveIcon } from '@/icons/drive';
import { EngineIcon } from '@/icons/engine';
import { FingerprintIcon } from '@/icons/fingerprint';
import { FuelIcon } from '@/icons/fuel';
import { GaugeIcon } from '@/icons/gauge';
import { ToolsIcon } from '@/icons/tools';
import { TransmissionIcon } from '@/icons/transmission';
import type { Car } from '@/types';
import type { SvgA11yProps } from '@/ui/decorative/svg-a11y/svg-a11y';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';

const DATA_FIELDS: {
  label: string;
  key: keyof Car;
  icon: React.ComponentType<SvgA11yProps>;
}[] = [
  { label: 'VIN', key: 'vin', icon: FingerprintIcon },
  { label: 'YEAR', key: 'production_year', icon: CalendarIcon },
  { label: 'MILEAGE', key: 'mileage', icon: GaugeIcon },
  { label: 'ENGINE CAPACITY', key: 'engine_capacity', icon: EngineIcon },
  { label: 'DRIVE TYPE', key: 'drive_type', icon: DriveIcon },
  { label: 'TRANSMISSION', key: 'transmission_type', icon: TransmissionIcon },
  { label: 'FUEL TYPE', key: 'fuel_type', icon: FuelIcon },
  { label: 'ADDITIONAL FUEL', key: 'additional_fuel_type', icon: FuelIcon },
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

      <div className="my-5 flex flex-wrap justify-between gap-5 md:grid md:grid-cols-3">
        {DATA_FIELDS.map(({ label, key, icon }) => (
          <DetailsCardDataField
            key={key}
            icon={icon}
            label={label}
            value={data?.[key]}
          />
        ))}
      </div>

      <TextSeparator
        className="text-alpha-grey-500 my-10 text-xs"
        text="LEGAL & COMPLIANCE"
      />

      <div className="flex flex-col gap-5">
        <DetailsCardExpirationRow
          date={data?.insurance_expiration}
          icon={CheckShieldIcon}
          label="Insurance"
        />
        <DetailsCardExpirationRow
          date={data?.technical_inspection_expiration}
          icon={ToolsIcon}
          label="Technical inspection"
        />
      </div>
    </div>
  );
}
