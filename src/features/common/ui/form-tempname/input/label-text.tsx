type LabelTextProps = {
  text: string;
  required: boolean;
};

export function LabelText({ text, required }: LabelTextProps) {
  return (
    <p>
      <span className="text-xs">{text}</span>
      {required && <span className="text-error-400 mx-1">*</span>}
    </p>
  );
}
