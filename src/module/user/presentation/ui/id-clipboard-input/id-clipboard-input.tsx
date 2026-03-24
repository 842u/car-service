import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { CheckIcon } from '@/icons/check';
import { ClipboardIcon } from '@/icons/clipboard';
import { inputVariants } from '@/lib/tailwindcss/input';

type IdClipboardInputProps = {
  id?: string;
  label?: string;
  className?: string;
  variant?: keyof typeof inputVariants;
};

export function IdClipboardInput({
  id,
  label = 'ID',
  className,
  variant = 'default',
}: IdClipboardInputProps) {
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
    <label className="selection:bg-accent-500 block max-w-72" title="Copy ID">
      {label && (
        <p>
          <span className="text-xs">{label}</span>
        </p>
      )}

      <div
        className={twMerge(
          inputVariants[variant],
          'my-1 flex items-center p-0',
          'focus-within:border-accent-500 hover:border-accent-500 transition-colors',
          className,
        )}
      >
        <input
          readOnly
          className="text-alpha-grey-900 inline-block h-full w-full cursor-pointer truncate pl-3 text-xs outline-none"
          placeholder="..."
          value={id ?? ''}
          onClick={handleCopy}
        />

        <div className="flex h-full cursor-pointer items-center justify-center p-2">
          {copied ? (
            <CheckIcon className="h-full w-full stroke-3" />
          ) : (
            <ClipboardIcon className="h-full w-full stroke-3" />
          )}
        </div>
      </div>
    </label>
  );
}
