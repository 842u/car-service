type ErrorTextProps = {
  errorMessage: string | undefined;
};

export function InputErrorText({ errorMessage }: ErrorTextProps) {
  return (
    <p className="text-error-400 text-sm whitespace-pre-wrap">
      {errorMessage || ' '}
    </p>
  );
}
