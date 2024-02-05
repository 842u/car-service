import { twMerge } from 'tailwind-merge';

type TextSeparatorProps = {
  text?: string;
  className?: string;
};

export function TextSeparator({ text, className }: TextSeparatorProps) {
  return (
    <p
      className={twMerge(
        'flex flex-row items-center before:h-[1px] before:flex-grow before:bg-alpha-grey-300 after:h-[1px] after:flex-grow after:bg-alpha-grey-300',
        className,
      )}
      data-testid="text-separator"
    >
      {text && <span className="mx-2">{text}</span>}
    </p>
  );
}
