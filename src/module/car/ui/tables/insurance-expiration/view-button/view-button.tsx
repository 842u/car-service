import { EyeOpenIcon } from '@/icons/eye-open';
import { LinkButton } from '@/ui/link-button/link-button';

interface InsuranceExpirationTableViewButtonProps {
  carId: string;
}

export function InsuranceExpirationTableViewButton({
  carId,
}: InsuranceExpirationTableViewButtonProps) {
  const carUrl = new URL(`${window.location.origin}/dashboard/cars/${carId}`);

  return (
    <LinkButton href={carUrl} variant="accent">
      <div className="flex h-full w-full flex-row items-center justify-center gap-2">
        <p>View</p>
        <EyeOpenIcon className="h-full stroke-2" />
      </div>
    </LinkButton>
  );
}
