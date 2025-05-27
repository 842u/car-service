'use client';

import { useRef } from 'react';

import { PencilIcon } from '@/components/decorative/icons/PencilIcon';
import { TrashIcon } from '@/components/decorative/icons/TrashIcon';
import { ServiceLog } from '@/types';

import { CarServiceLogEditForm } from '../../forms/CarServiceLogEditForm/CarServiceLogEditForm';
import {
  DialogModal,
  DialogModalRef,
} from '../../shared/base/DialogModal/DialogModal';
import { IconButton } from '../../shared/IconButton/IconButton';

type CarServiceLogsTableRowProps = {
  serviceLog: ServiceLog;
  carId: string;
};

export function CarServiceLogsTableRow({
  serviceLog,
  carId,
}: CarServiceLogsTableRowProps) {
  const editDialogModalRef = useRef<DialogModalRef>(null);

  const handleEditLogButtonClick = () =>
    editDialogModalRef.current?.showModal();

  const handleCarServiceLogEditFormSubmit = () =>
    editDialogModalRef.current?.closeModal();
  return (
    <tr
      key={serviceLog.id}
      className="border-alpha-grey-300 border-b first-of-type:border-t-0 last-of-type:border-b-0"
    >
      <td className="w-0 p-2 whitespace-nowrap">{serviceLog.service_date}</td>
      <td className="w-0 p-2">{serviceLog.category}</td>
      <td className="max-w-16 overflow-auto p-2 lg:max-w-fit">
        {serviceLog.mileage}
      </td>
      <td className="max-w-16 overflow-auto p-2 lg:max-w-fit">
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
          <IconButton title="delete log" variant="accent">
            <TrashIcon className="min-h-full min-w-full stroke-2" />
          </IconButton>
          <DialogModal ref={editDialogModalRef} headingText="Edit service log">
            <CarServiceLogEditForm
              carId={carId}
              serviceLog={serviceLog}
              onSubmit={handleCarServiceLogEditFormSubmit}
            />
          </DialogModal>
        </div>
      </td>
    </tr>
  );
}
