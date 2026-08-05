import { DeleteButton } from '@/car/presentation/ui/buttons/delete/delete';
import { DeleteModal } from '@/car/presentation/ui/modals/delete/delete';
import { useSectionControls } from '@/car/presentation/ui/sections/delete/controls/use-controls';
import { DashboardSection } from '@/dashboard/ui/section/section';

type SectionControlsProps = {
  carId: string;
  canDelete: boolean;
};

export function SectionControls({ carId, canDelete }: SectionControlsProps) {
  const {
    dialogRef,
    handleDeleteButtonClick,
    handleDeleteModalCancel,
    handleDeleteModalConfirm,
  } = useSectionControls({ carId });

  return (
    <DashboardSection.Controls>
      <DeleteButton disabled={!canDelete} onClick={handleDeleteButtonClick} />
      <DeleteModal
        ref={dialogRef}
        canDelete={canDelete}
        onCancel={handleDeleteModalCancel}
        onConfirm={handleDeleteModalConfirm}
      />
    </DashboardSection.Controls>
  );
}
