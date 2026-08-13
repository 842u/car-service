type LabelTextProps = {
  text: string;
  required: boolean;
};

export function InputLabelText({ text, required }: LabelTextProps) {
  return (
    <span className="block">
      <span className="text-xs">{text}</span>
      {required && <span className="text-error-400 mx-1">*</span>}
    </span>
  );
}
