import { CarPlusIcon } from '@/components/decorative/icons/CarPlusIcon';

export function AddCarButton() {
  return (
    <button className="border-accent-400 bg-accent-800 hover:bg-accent-700 dark:bg-accent-900 dark:hover:bg-accent-800 aspect-square w-36 cursor-pointer rounded-2xl border-2 transition-colors">
      <CarPlusIcon className="m-4 stroke-2" />
    </button>
  );
}
