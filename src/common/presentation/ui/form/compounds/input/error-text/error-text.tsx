type ErrorTextProps = {
  id: string;
  errorMessage: string | undefined;
};

export function InputErrorText({ id, errorMessage }: ErrorTextProps) {
  return (
    <p className="text-error-400 text-sm whitespace-pre-wrap" id={id}>
      {errorMessage || ' '}
    </p>
  );
}
