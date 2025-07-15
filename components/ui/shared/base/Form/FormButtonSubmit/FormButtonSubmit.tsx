import { Spinner } from '@/components/decorative/Spinner/Spinner';

import { Button, ButtonProps } from '../../Button/Button';
import { useForm } from '../Form';

type FormButtonSubmit = ButtonProps & {
  children: string;
  isSubmitting?: boolean;
};

export function FormButtonSubmit({
  children,
  isSubmitting = false,
  ...props
}: FormButtonSubmit) {
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
