type FormInputLabelTextProps = {
  text: string;
  required: boolean;
};

export function FormInputLabelText({
  text,
  required,
}: FormInputLabelTextProps) {
  return (
    <p>
      <span className="text-xs">{text}</span>
      {required && <span className="text-error-400 mx-1">*</span>}
    </p>
  );
}
