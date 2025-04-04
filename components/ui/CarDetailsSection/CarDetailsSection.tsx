import { useRef } from 'react';

import { CarEditIcon } from '@/components/decorative/icons/CarEditIcon';
import { Car } from '@/types';

import { EditCarForm } from '../CarForm/EditCarForm';
import { DialogModal, DialogModalRef } from '../DialogModal/DialogModal';
import { IconButton } from '../IconButton/IconButton';

type CarDetailsSectionProps = {
  carId: string;
  carData: Car | undefined;
  isCurrentUserPrimaryOwner: boolean;
};

export function CarDetailsSection({
  carId,
  carData,
  isCurrentUserPrimaryOwner,
}: CarDetailsSectionProps) {
  const dialogModalRef = useRef<DialogModalRef>(null);

  return (
    <section>
      <h2 className="my-2 text-xl">Details</h2>
      <div className="border-alpha-grey-300 overflow-hidden rounded-lg border p-2 md:flex md:flex-wrap md:gap-2">
        <section className="mb-5 md:m-0 md:w-1/3 md:grow">
          <h3 className="my-1 text-lg">Basic</h3>
          <div className="border-alpha-grey-300 overflow-hidden rounded-lg border p-2">
            <table className="w-full">
              <caption className="sr-only">Car basic information table</caption>
              <tbody>
                <tr className="even:bg-alpha-grey-100">
                  <th className="text-left font-normal">Name:</th>
                  <td className="text-right">{carData?.custom_name}</td>
                </tr>
                <tr className="even:bg-alpha-grey-100">
                  <th className="text-left font-normal">Brand:</th>
                  <td className="text-right">{carData?.brand}</td>
                </tr>
                <tr className="even:bg-alpha-grey-100">
                  <th className="text-left font-normal">Model:</th>
                  <td className="text-right">{carData?.model}</td>
                </tr>
                <tr className="even:bg-alpha-grey-100">
                  <th className="text-left font-normal">Production year:</th>
                  <td className="text-right">{carData?.production_year}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="mb-5 md:m-0 md:w-1/3 md:grow">
          <h3 className="my-1 text-lg">Identification</h3>
          <div className="border-alpha-grey-300 overflow-hidden rounded-lg border p-2">
            <table className="w-full">
              <caption className="sr-only">
                Car identification details table
              </caption>
              <tbody>
                <tr className="even:bg-alpha-grey-100">
                  <th className="text-left font-normal">License plates:</th>
                  <td className="text-right">{carData?.license_plates}</td>
                </tr>
                <tr className="even:bg-alpha-grey-100">
                  <th className="text-left font-normal">VIN:</th>
                  <td className="text-right">{carData?.vin}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="mb-5 md:m-0 md:w-1/3 md:grow">
          <h3 className="my-1 text-lg">Powertrain</h3>
          <div className="border-alpha-grey-300 overflow-hidden rounded-lg border p-2">
            <table className="w-full">
              <caption className="sr-only">
                Car powertrain details table
              </caption>
              <tbody>
                <tr className="even:bg-alpha-grey-100">
                  <th className="text-left font-normal">
                    Engine capacity [cc]:
                  </th>
                  <td className="text-right">{carData?.engine_capacity}</td>
                </tr>
                <tr className="even:bg-alpha-grey-100">
                  <th className="text-left font-normal">Fuel type:</th>
                  <td className="text-right">{carData?.fuel_type}</td>
                </tr>
                <tr className="even:bg-alpha-grey-100">
                  <th className="text-left font-normal">
                    Additional fuel type:
                  </th>
                  <td className="text-right">
                    {carData?.additional_fuel_type}
                  </td>
                </tr>
                <tr className="even:bg-alpha-grey-100">
                  <th className="text-left font-normal">Drive type:</th>
                  <td className="text-right">{carData?.drive_type}</td>
                </tr>
                <tr className="even:bg-alpha-grey-100">
                  <th className="text-left font-normal">Transmission type:</th>
                  <td className="text-right">{carData?.transmission_type}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="mb-5 md:m-0 md:w-1/3 md:grow">
          <h3 className="my-1 text-lg">Maintenance</h3>
          <div className="border-alpha-grey-300 overflow-hidden rounded-lg border p-2">
            <table className="w-full">
              <caption className="sr-only">
                Car maintenance details table
              </caption>
              <tbody>
                <tr className="even:bg-alpha-grey-100">
                  <th className="text-left font-normal">Mileage [km]</th>
                  <td className="text-right">{carData?.mileage}</td>
                </tr>
                <tr className="even:bg-alpha-grey-100">
                  <th className="text-left font-normal">
                    Insurance expiration:
                  </th>
                  <td className="text-right">
                    {carData?.insurance_expiration}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <div className="m-5 flex justify-end gap-5">
        <IconButton
          className="group"
          disabled={!isCurrentUserPrimaryOwner}
          title="edit car"
          onClick={() => dialogModalRef.current?.showModal()}
        >
          <CarEditIcon className="group-disabled:stroke-light-800 h-full w-full stroke-2" />
        </IconButton>
      </div>
      <DialogModal ref={dialogModalRef}>
        <EditCarForm
          carData={carData}
          carId={carId}
          onSubmit={() => dialogModalRef.current?.closeModal()}
        />
      </DialogModal>
    </section>
  );
}
