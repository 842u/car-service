import { DeleteModal } from '@/car/ownership/ui/modals/delete/delete';
import { PromoteModal } from '@/car/ownership/ui/modals/promote/promote';
import { useDropdownContent } from '@/car/ownership/ui/tables/ownerships/actions-dropdown/content/use-content';
import type { CarOwnership } from '@/types';
import { Button } from '@/ui/button/button';
import { Dropdown } from '@/ui/dropdown/dropdown';

interface DropdownContentProps {
  canDelete: boolean;
  canPromote: boolean;
  ownership: CarOwnership;
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
    <Dropdown.Content collisionDetection align="end" side="bottom">
      <Button
        className="w-full"
        disabled={!canPromote}
        variant="transparent"
        onClick={handlePromoteButtonClick}
      >
        Promote
      </Button>
      <PromoteModal
        ref={promoteModalRef}
        canPromote={canPromote}
        username={username}
        onCancel={handlePromoteModalCancel}
        onConfirm={handlePromoteModalConfirm}
      />
      <Button
        className="w-full"
        disabled={!canDelete}
        variant="transparentError"
        onClick={handleDeleteButtonClick}
      >
        Delete
      </Button>
      <DeleteModal
        ref={deleteModalRef}
        canDelete={canDelete}
        selfDeletion={selfDeletion}
        username={username}
        onCancel={handleDeleteModalCancel}
        onConfirm={handleDeleteModalConfirm}
      />
    </Dropdown.Content>
  );
}
