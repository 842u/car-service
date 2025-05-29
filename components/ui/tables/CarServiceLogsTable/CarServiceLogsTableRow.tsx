'use client';

import { PencilIcon } from '@/components/decorative/icons/PencilIcon';
import { TrashIcon } from '@/components/decorative/icons/TrashIcon';
import { ServiceLog } from '@/types';

import { CarServiceLogEditForm } from '../../forms/CarServiceLogEditForm/CarServiceLogEditForm';
import { Button } from '../../shared/base/Button/Button';
import { DialogModal } from '../../shared/base/DialogModal/DialogModal';
import { IconButton } from '../../shared/IconButton/IconButton';
import { useCarServiceLogsTableRow } from './useCarServiceLogsTableRow';

export type CarServiceLogsTableRowProps = {
  serviceLog: ServiceLog;
  carId: string;
};

export function CarServiceLogsTableRow({
  serviceLog,
  carId,
}: CarServiceLogsTableRowProps) {
  const {
    editDialogModalRef,
    deleteDialogModalRef,
    handleCancelDeleteServiceLogButtonClick,
    handleCarServiceLogEditFormSubmit,
    handleConfirmDeleteServiceLogButtonClick,
    handleDeleteServiceLogButtonClick,
    handleEditLogButtonClick,
  } = useCarServiceLogsTableRow({ carId, serviceLog });

  return (
    <tr
      key={serviceLog.id}
      className="border-alpha-grey-300 border-b first-of-type:border-t-0 last-of-type:border-b-0"
    >
      <td className="w-0 p-2 whitespace-nowrap">{serviceLog.service_date}</td>
      <td className="w-0 p-2">
        <div className="max-h-16 w-fit overflow-y-auto">
          {serviceLog.category.map((value) => (
            <p key={value}>{value}</p>
          ))}
        </div>
      </td>
      <td className="w-0 max-w-16 overflow-auto p-2 lg:max-w-fit">
        {serviceLog.mileage}
      </td>
      <td className="w-0 max-w-16 overflow-auto p-2 lg:max-w-fit">
        {serviceLog.service_cost}
      </td>
      <td className="p-2">
        <p className="max-h-16 min-w-48 overflow-y-auto">{serviceLog.notes}</p>
      </td>
      <td className="w-0 p-2">
        <div className="flex w-auto gap-4">
          <IconButton
            title="edit log"
            variant="accent"
            onClick={handleEditLogButtonClick}
          >
            <PencilIcon className="min-h-full min-w-full stroke-2" />
          </IconButton>
          <IconButton
            title="delete log"
            variant="error"
            onClick={handleDeleteServiceLogButtonClick}
          >
            <TrashIcon className="min-h-full min-w-full stroke-2" />
          </IconButton>
          <DialogModal ref={editDialogModalRef} headingText="Edit service log">
            <CarServiceLogEditForm
              carId={carId}
              serviceLog={serviceLog}
              onSubmit={handleCarServiceLogEditFormSubmit}
            />
          </DialogModal>
          <DialogModal
            ref={deleteDialogModalRef}
            headingText="Delete service log"
          >
            <p className="my-4">Are you sure you want to delete service log?</p>
            <div className="flex w-full flex-col gap-4 md:flex-row md:justify-end md:px-4">
              <Button onClick={handleCancelDeleteServiceLogButtonClick}>
                Cancel
              </Button>
              <Button
                variant="error"
                onClick={handleConfirmDeleteServiceLogButtonClick}
              >
                Delete
              </Button>
            </div>
          </DialogModal>
        </div>
      </td>
    </tr>
  );
}
