import { CarPlusIcon } from '@/icons/car-plus';
import { IconButton, IconButtonProps } from '@/ui/icon-button/icon-button';

type AddButtonProps = Partial<IconButtonProps>;

export function AddButton({ ...props }: AddButtonProps) {
  return (
    <IconButton text="Add car" variant="accent" {...props}>
      <CarPlusIcon className="fill-light-500 h-full stroke-[0.5] py-0.5" />
    </IconButton>
  );
}
