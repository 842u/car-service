import { Spinner } from '@/features/common/ui/decorative/spinner/spinner';

import { Button, ButtonProps } from '../../button/button';
import { useForm } from '../form';

export type FormButtonSubmitProps = ButtonProps & {
  children: string;
  isSubmitting?: boolean;
};

export function FormButtonSubmit({
  children,
  isSubmitting = false,
  ...props
}: FormButtonSubmitProps) {
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
