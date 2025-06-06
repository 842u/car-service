'use client';

import { EllipsisIcon } from '@/components/decorative/icons/EllipsisIcon';
import { ServiceLog } from '@/types';

import { CarServiceLogEditForm } from '../../forms/CarServiceLogEditForm/CarServiceLogEditForm';
import { Button } from '../../shared/base/Button/Button';
import { DialogModal } from '../../shared/base/DialogModal/DialogModal';
import { Dropdown } from '../../shared/base/Dropdown/Dropdown';
import { IconButton } from '../../shared/IconButton/IconButton';
import { useCarServiceLogsTableRow } from './useCarServiceLogsTableRow';

export type CarServiceLogsTableRowProps = {
  serviceLog: ServiceLog;
  carId: string;
  userId: string;
  isCurrentUserPrimaryOwner: boolean;
};

export function CarServiceLogsTableRow({
  serviceLog,
  carId,
  userId,
  isCurrentUserPrimaryOwner,
}: CarServiceLogsTableRowProps) {
  const {
    canModifyLog,
    editDialogModalRef,
    deleteDialogModalRef,
    handleCancelDeleteServiceLogButtonClick,
    handleCarServiceLogEditFormSubmit,
    handleConfirmDeleteServiceLogButtonClick,
    handleDeleteServiceLogButtonClick,
    handleEditLogButtonClick,
  } = useCarServiceLogsTableRow({
    carId,
    userId,
    serviceLog,
    isCurrentUserPrimaryOwner,
  });

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
        <Dropdown>
          <Dropdown.Trigger>
            {({ onClick, ref }) => (
              <IconButton
                ref={ref}
                title="Actions"
                variant="transparent"
                onClick={onClick}
              >
                <EllipsisIcon className="fill-dark-500 dark:fill-light-500 w-full px-1" />
              </IconButton>
            )}
          </Dropdown.Trigger>
          <Dropdown.Content snap="bottom-right">
            <Button
              className="w-full"
              disabled={!canModifyLog}
              variant="transparent"
              onClick={handleEditLogButtonClick}
            >
              Edit
            </Button>
            <DialogModal
              ref={editDialogModalRef}
              headingText="Edit service log"
            >
              <CarServiceLogEditForm
                carId={carId}
                serviceLog={serviceLog}
                onSubmit={handleCarServiceLogEditFormSubmit}
              />
            </DialogModal>
            <Button
              disabled={!canModifyLog}
              variant="transparent"
              onClick={handleDeleteServiceLogButtonClick}
            >
              Delete
            </Button>
            <DialogModal
              ref={deleteDialogModalRef}
              headingText="Delete service log"
            >
              <p className="my-4">
                Are you sure you want to delete service log?
              </p>
              <div className="flex w-full flex-col gap-4 md:flex-row md:justify-end md:px-4">
                <Button onClick={handleCancelDeleteServiceLogButtonClick}>
                  Cancel
                </Button>
                <Button
                  disabled={!canModifyLog}
                  variant="error"
                  onClick={handleConfirmDeleteServiceLogButtonClick}
                >
                  Delete
                </Button>
              </div>
            </DialogModal>
          </Dropdown.Content>
        </Dropdown>
      </td>
    </tr>
  );
}
