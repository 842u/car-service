import { twMerge } from 'tailwind-merge';

type TextSeparatorProps = {
  text?: string;
  className?: string;
};

export function TextSeparator({ text, className }: TextSeparatorProps) {
  return (
    <p
      className={twMerge(
        'before:bg-alpha-grey-300 after:bg-alpha-grey-300 flex flex-row items-center before:h-[1px] before:grow after:h-[1px] after:grow',
        className,
      )}
      data-testid="text-separator"
    >
      {text && <span className="mx-2">{text}</span>}
    </p>
  );
}
