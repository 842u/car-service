import { BrandFullIcon } from '@/icons/brand-full';
import { CarPlusIcon } from '@/icons/car-plus';
import { Card } from '@/ui/card/card';

interface AddCardProps {
  onClick?: () => void;
}

export function AddCard({ onClick }: AddCardProps) {
  return (
    <Card
      className="border-accent-500/40 flex w-80 cursor-pointer flex-col items-center justify-center gap-6 border-dashed p-6 text-center"
      role="button"
      tabIndex={0}
      onClick={onClick}
    >
      <div className="relative">
        <BrandFullIcon className="stroke-alpha-grey-500 w-full stroke-[0.1]" />

        <div className="bg-accent-100 dark:bg-accent-900/70 absolute -top-5 right-0 flex h-14 w-14 items-center justify-center rounded-lg font-bold text-white shadow">
          <CarPlusIcon className="fill-light-500 stroke-light-500 stroke-[0.5] p-2" />
        </div>
      </div>

      <div>
        <p className="text-2xl font-semibold">Add a car</p>
        <p className="text-alpha-grey-900 text-sm">
          Create a new vehicle entry
        </p>
      </div>
    </Card>
  );
}
