import type { CarDto } from '@/car/application/dto/car';
import { DetailsCardDataField } from '@/car/presentation/ui/cards/details/data-field/data-field';
import { DetailsCardExpirationRow } from '@/car/presentation/ui/cards/details/expiration-row/expiration-row';
import { DetailsCardHeader } from '@/car/presentation/ui/cards/details/header/header';
import { CalendarIcon } from '@/icons/calendar';
import { CheckShieldIcon } from '@/icons/check-shield';
import { DriveIcon } from '@/icons/drive';
import { EngineIcon } from '@/icons/engine';
import { FingerprintIcon } from '@/icons/fingerprint';
import { FuelIcon } from '@/icons/fuel';
import { GaugeIcon } from '@/icons/gauge';
import { ToolsIcon } from '@/icons/tools';
import { TransmissionIcon } from '@/icons/transmission';
import type { SvgA11yProps } from '@/ui/decorative/svg-a11y/svg-a11y';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';

const DATA_FIELDS: {
  label: string;
  key: keyof CarDto;
  icon: React.ComponentType<SvgA11yProps>;
}[] = [
  { label: 'VIN', key: 'vin', icon: FingerprintIcon },
  { label: 'YEAR', key: 'productionYear', icon: CalendarIcon },
  { label: 'MILEAGE', key: 'mileage', icon: GaugeIcon },
  { label: 'ENGINE CAPACITY', key: 'engineCapacity', icon: EngineIcon },
  { label: 'DRIVE TYPE', key: 'driveType', icon: DriveIcon },
  { label: 'TRANSMISSION', key: 'transmissionType', icon: TransmissionIcon },
  { label: 'FUEL TYPE', key: 'fuelType', icon: FuelIcon },
  { label: 'ADDITIONAL FUEL', key: 'additionalFuelType', icon: FuelIcon },
];

interface DetailsCardProps {
  car?: CarDto;
  className?: string;
}

export function DetailsCard({ car, className }: DetailsCardProps) {
  return (
    <div className={className}>
      <DetailsCardHeader car={car} />

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
            value={car?.[key]}
          />
        ))}
      </div>

      <TextSeparator
        className="text-alpha-grey-500 my-10 text-xs"
        text="LEGAL & COMPLIANCE"
      />

      <div className="flex flex-col gap-5">
        <DetailsCardExpirationRow
          date={car?.insuranceExpiration}
          icon={CheckShieldIcon}
          label="Insurance"
        />
        <DetailsCardExpirationRow
          date={car?.technicalInspectionExpiration}
          icon={ToolsIcon}
          label="Technical inspection"
        />
      </div>
    </div>
  );
}
