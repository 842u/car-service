import { BookIcon } from '@/components/decorative/icons/BookIcon';

import {
  IconButton,
  IconButtonProps,
} from '../../shared/IconButton/IconButton';

type ServiceLogAddButtonProps = Partial<IconButtonProps>;

export function ServiceLogAddButton({ ...props }: ServiceLogAddButtonProps) {
  return (
    <IconButton text="Add log" variant="accent" {...props}>
      <BookIcon className="h-full stroke-2 py-0.5" />
    </IconButton>
  );
}
