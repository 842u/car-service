import { CarPlusIcon } from '@/features/common/ui/decorative/icons/CarPlusIcon';

import {
  IconButton,
  IconButtonProps,
} from '../../../../features/common/ui/IconButton/IconButton';

type CarAddButtonProps = Partial<IconButtonProps>;

export function CarAddButton({ ...props }: CarAddButtonProps) {
  return (
    <IconButton text="Add car" variant="accent" {...props}>
      <CarPlusIcon className="fill-light-500 h-full stroke-[0.5] py-0.5" />
    </IconButton>
  );
}
