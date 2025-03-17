import { Car } from '@/types';

type CarDetailsProps = {
  carData?: Car;
  showDetails: boolean;
};

export default function CarDetails({ showDetails, carData }: CarDetailsProps) {
  return (
    <div className={showDetails ? 'flex flex-col gap-5' : 'hidden'}>
      {carData?.brand && (
        <p className="flex justify-between">
          <span className="text-light-800">Brand: </span>
          <span>{carData.brand}</span>
        </p>
      )}
      {carData?.model && (
        <p className="flex justify-between">
          <span className="text-light-800">Model: </span>
          <span>{carData.model}</span>
        </p>
      )}
      {carData?.production_year && (
        <p className="flex justify-between">
          <span className="text-light-800">Production year: </span>
          <span>{carData.production_year}</span>
        </p>
      )}
      {carData?.license_plates && (
        <p className="flex justify-between">
          <span className="text-light-800">License plates: </span>
          <span>{carData.license_plates}</span>
        </p>
      )}
      {carData?.drive_type && (
        <p className="flex justify-between">
          <span className="text-light-800">Drive type: </span>
          <span>{carData.drive_type}</span>
        </p>
      )}
      {carData?.fuel_type && (
        <p className="flex justify-between">
          <span className="text-light-800">Fuel type: </span>
          <span>{carData.fuel_type}</span>
        </p>
      )}
      {carData?.additional_fuel_type && (
        <p className="flex justify-between">
          <span className="text-light-800">Additional fuel type: </span>
          <span>{carData.additional_fuel_type}</span>
        </p>
      )}
      {carData?.engine_capacity && (
        <p className="flex justify-between">
          <span className="text-light-800">Engine capacity [cc]: </span>
          <span>{carData.engine_capacity}</span>
        </p>
      )}
      {carData?.mileage && (
        <p className="flex justify-between">
          <span className="text-light-800">Mileage [km]: </span>
          <span>{carData.mileage}</span>
        </p>
      )}

      {carData?.vin && (
        <p className="flex justify-between">
          <span className="text-light-800">VIN: </span>
          <span>{carData.vin}</span>
        </p>
      )}
      {carData?.transmission_type && (
        <p className="flex justify-between">
          <span className="text-light-800">Transmission type: </span>
          <span>{carData.transmission_type}</span>
        </p>
      )}
      {carData?.insurance_expiration && (
        <p className="flex justify-between">
          <span className="text-light-800">Insurance expiration: </span>
          <span>{carData.insurance_expiration}</span>
        </p>
      )}
    </div>
  );
}
