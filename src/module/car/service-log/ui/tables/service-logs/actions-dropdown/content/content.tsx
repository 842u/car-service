import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import { EditModal } from '@/car/service-log/presentation/ui/modals/edit/edit';
import { DeleteModal } from '@/car/service-log/ui/modals/delete/delete';
import { useDropdownContent } from '@/car/service-log/ui/tables/service-logs/actions-dropdown/content/use-content';
import { Button } from '@/ui/button/button';
import { Dropdown } from '@/ui/dropdown/dropdown';

interface DropdownContentProps {
  canTakeAction: boolean;
  carId: string;
  serviceLog: ServiceLogDto;
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
    <>
      <EditModal
        ref={editModalRef}
        serviceLog={serviceLog}
        onSubmit={handleEditModalSubmit}
      />
      <DeleteModal
        ref={deleteModalRef}
        canTakeAction={canTakeAction}
        onCancel={handleDeleteModalCancel}
        onConfirm={handleDeleteModalConfirm}
      />

      <Dropdown.Content collisionDetection align="end" side="bottom">
        <Button
          className="w-full"
          disabled={!canTakeAction}
          variant="transparent"
          onClick={handleEditButtonClick}
        >
          Edit
        </Button>
        <Button
          disabled={!canTakeAction}
          variant="transparentError"
          onClick={handleDeleteButtonClick}
        >
          Delete
        </Button>
      </Dropdown.Content>
    </>
  );
}
