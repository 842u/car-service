import { Button, ButtonProps } from '@/ui/button-tempname/button-tempname';
import { Spinner } from '@/ui/decorative/spinner-tempname/spinner-tempname';

import { useForm } from '../form-tempname';

export type ButtonSubmitProps = ButtonProps & {
  children: string;
  isSubmitting?: boolean;
};

export function ButtonSubmit({
  children,
  isSubmitting = false,
  ...props
}: ButtonSubmitProps) {
  useForm();

  return (
    <Button type="submit" variant="accent" {...props}>
      {isSubmitting ? (
        <Spinner className="stroke-alpha-grey-900 fill-alpha-grey-900 m-auto h-full" />
      ) : (
        children
      )}
    </Button>
  );
}
