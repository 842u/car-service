import { Button } from '../Button/Button';
import { Spinner } from '../Spinner/Spinner';

type SubmitButtonProps = {
  disabled?: boolean;
  isSubmitting?: boolean;
  className?: string;
  children: string;
};

export function SubmitButton({
  disabled = false,
  isSubmitting = false,
  className = '',
  children,
}: SubmitButtonProps) {
  return (
    <Button
      aria-label={children}
      className={className}
      disabled={disabled}
      type="submit"
      variant="accent"
    >
      {isSubmitting ? (
        <Spinner className="stroke-alpha-grey-900 fill-alpha-grey-900 m-auto h-full" />
      ) : (
        children
      )}
    </Button>
  );
}
