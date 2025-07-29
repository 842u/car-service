import { BookIcon } from '@/ui/decorative/icons/book';
import { IconButton, IconButtonProps } from '@/ui/icon-button/icon-button';

type AddButtonProps = Partial<IconButtonProps>;

export function AddButton({ ...props }: AddButtonProps) {
  return (
    <IconButton text="Add log" variant="accent" {...props}>
      <BookIcon className="h-full stroke-2 py-0.5" />
    </IconButton>
  );
}
