import type { SyntheticEvent } from 'react';
import { twMerge } from 'tailwind-merge';

import { useToasts } from '@/common/hooks/use-toasts';
import { inputVariants } from '@/utils/tailwindcss/input';

type IdClipboardInputProps = {
  id?: string;
};

export function IdClipboardInput({ id }: IdClipboardInputProps) {
  const { addToast } = useToasts();

  const handleInputClick = async (event: SyntheticEvent<HTMLInputElement>) => {
    if (!id) return;

    event.currentTarget.select();

    const clipboardItemData = {
      'text/plain': id,
    };

    const clipboardItem = new ClipboardItem(clipboardItemData);

    try {
      await navigator.clipboard.write([clipboardItem]);
      addToast('ID copied.', 'success');
    } catch (error) {
      if (error instanceof Error) {
        addToast('Writing to the clipboard is not allowed.', 'error');
      }
    }
  };

  return (
    <input
      readOnly
      aria-label="current user ID"
      className={twMerge(
        inputVariants['default'],
        'selection:bg-accent-500 w-xs cursor-pointer overflow-x-auto text-center md:w-72 md:text-xs',
      )}
      defaultValue={id}
      placeholder="..."
      type="text"
      onClick={handleInputClick}
    />
  );
}
