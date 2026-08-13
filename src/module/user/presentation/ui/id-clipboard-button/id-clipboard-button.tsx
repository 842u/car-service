import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { CheckIcon } from '@/icons/check';
import { ClipboardIcon } from '@/icons/clipboard';
import { inputVariants } from '@/ui/variants/input';

type IdClipboardButtonProps = {
  id?: string;
  label?: string;
  className?: string;
  variant?: keyof typeof inputVariants;
};

export function IdClipboardButton({
  id,
  label = 'ID',
  className,
  variant = 'default',
}: IdClipboardButtonProps) {
  const { addToast } = useToasts();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!id) return;

    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      addToast('ID copied.', 'success');

      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast('Clipboard not allowed.', 'error');
    }
  };

  return (
    <div className="selection:bg-accent-500 block md:max-w-72">
      {label && (
        <p>
          <span className="text-xs">{label}</span>
        </p>
      )}

      <button
        aria-label={copied ? 'ID copied' : 'Copy ID'}
        className={twMerge(
          inputVariants[variant],
          'my-1 flex items-center gap-2 p-0',
          'hover:border-accent-500 transition-colors',
          className,
        )}
        title={copied ? 'ID copied' : 'Copy ID'}
        type="button"
        onClick={handleCopy}
      >
        <span className="text-alpha-grey-900 grow truncate pl-3 text-center text-xs">
          {id ?? '...'}
        </span>

        <span className="flex h-full items-center justify-center p-2">
          {copied ? (
            <CheckIcon
              className="h-full w-full stroke-3"
              data-testid="check-icon"
            />
          ) : (
            <ClipboardIcon
              className="h-full w-full stroke-3"
              data-testid="clipboard-icon"
            />
          )}
        </span>
      </button>
    </div>
  );
}
