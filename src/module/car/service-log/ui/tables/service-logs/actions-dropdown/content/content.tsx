import { DeleteModal } from '@/car/service-log/ui/modals/delete/delete';
import { EditModal } from '@/car/service-log/ui/modals/edit/edit';
import { useDropdownContent } from '@/car/service-log/ui/tables/service-logs/actions-dropdown/content/use-content';
import type { ServiceLog } from '@/types';
import { Button } from '@/ui/button/button';
import { Dropdown } from '@/ui/dropdown/dropdown';

interface DropdownContentProps {
  canTakeAction: boolean;
  carId: string;
  serviceLog: ServiceLog;
}

export function DropdownContent({
  canTakeAction,
  carId,
  serviceLog,
}: DropdownContentProps) {
  const {
    deleteModalRef,
    editModalRef,
    handleDeleteButtonClick,
    handleDeleteModalCancel,
    handleDeleteModalConfirm,
    handleEditButtonClick,
    handleEditModalSubmit,
  } = useDropdownContent({ carId, serviceLogId: serviceLog.id });

  return (
    <Dropdown.Content collisionDetection align="end" side="bottom">
      <Button
        className="w-full"
        disabled={!canTakeAction}
        variant="transparent"
        onClick={handleEditButtonClick}
      >
        Edit
      </Button>
      <EditModal
        ref={editModalRef}
        serviceLog={serviceLog}
        onSubmit={handleEditModalSubmit}
      />
      <Button
        disabled={!canTakeAction}
        variant="transparentError"
        onClick={handleDeleteButtonClick}
      >
        Delete
      </Button>
      <DeleteModal
        ref={deleteModalRef}
        canTakeAction={canTakeAction}
        onCancel={handleDeleteModalCancel}
        onConfirm={handleDeleteModalConfirm}
      />
    </Dropdown.Content>
  );
}
