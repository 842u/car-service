type FormInputErrorTextProps = {
  errorMessage: string | undefined;
};

export function FormInputErrorText({ errorMessage }: FormInputErrorTextProps) {
  return (
    <p className="text-error-400 text-sm whitespace-pre-wrap">
      {errorMessage || ' '}
    </p>
  );
}
