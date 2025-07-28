import { CarPlusIcon } from '@/features/common/ui/decorative/icons/car-plus';

import {
  IconButton,
  IconButtonProps,
} from '../../../common/ui/icon-button/icon-button';

type CarAddButtonProps = Partial<IconButtonProps>;

export function CarAddButton({ ...props }: CarAddButtonProps) {
  return (
    <IconButton text="Add car" variant="accent" {...props}>
      <CarPlusIcon className="fill-light-500 h-full stroke-[0.5] py-0.5" />
    </IconButton>
  );
}
