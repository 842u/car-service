import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import { DeleteModal } from '@/car/ownership/presentation/ui/modals/delete/delete';
import { PromoteModal } from '@/car/ownership/presentation/ui/modals/promote/promote';
import { useDropdownContent } from '@/car/ownership/presentation/ui/tables/ownerships/actions-dropdown/content/use-content';
import { Button } from '@/ui/button/button';
import { Dropdown } from '@/ui/dropdown/dropdown';

interface DropdownContentProps {
  canDelete: boolean;
  canPromote: boolean;
  ownership: OwnershipDto;
  username?: string | null;
  sessionUserId?: string;
}

export function DropdownContent({
  canDelete,
  canPromote,
  ownership,
  username,
  sessionUserId,
}: DropdownContentProps) {
  const {
    selfDeletion,
    deleteModalRef,
    promoteModalRef,
    handleDeleteButtonClick,
    handleDeleteModalCancel,
    handleDeleteModalConfirm,
    handlePromoteButtonClick,
    handlePromoteModalCancel,
    handlePromoteModalConfirm,
  } = useDropdownContent({
    ownership,
    sessionUserId,
  });

  return (
    <>
      <DeleteModal
        ref={deleteModalRef}
        canDelete={canDelete}
        selfDeletion={selfDeletion}
        username={username}
        onCancel={handleDeleteModalCancel}
        onConfirm={handleDeleteModalConfirm}
      />
      <PromoteModal
        ref={promoteModalRef}
        canPromote={canPromote}
        username={username}
        onCancel={handlePromoteModalCancel}
        onConfirm={handlePromoteModalConfirm}
      />
      <Dropdown.Content collisionDetection align="end" side="bottom">
        <Button
          className="w-full"
          disabled={!canPromote}
          variant="transparent"
          onClick={handlePromoteButtonClick}
        >
          Promote
        </Button>

        <Button
          className="w-full"
          disabled={!canDelete}
          variant="transparentError"
          onClick={handleDeleteButtonClick}
        >
          Delete
        </Button>
      </Dropdown.Content>
    </>
  );
}
