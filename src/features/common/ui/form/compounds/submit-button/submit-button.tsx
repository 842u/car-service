import type { ButtonProps } from '@/ui/button/button';
import { Button } from '@/ui/button/button';
import { Spinner } from '@/ui/decorative/spinner/spinner';

import { useForm } from '../../form';

export type FormSubmitButtonProps = ButtonProps & {
  children: string;
  isSubmitting?: boolean;
};

export function FormSubmitButton({
  children,
  isSubmitting = false,
  ...props
}: FormSubmitButtonProps) {
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
