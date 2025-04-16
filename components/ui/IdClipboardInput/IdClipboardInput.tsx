import { SyntheticEvent } from 'react';
import { twMerge } from 'tailwind-merge';

import { useToasts } from '@/hooks/useToasts';
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
      className={twMerge(
        inputVariants['default'],
        'mx-auto block w-xs cursor-pointer overflow-x-auto text-center',
      )}
      defaultValue={id}
      placeholder="..."
      type="text"
      onClick={handleInputClick}
    />
  );
}
