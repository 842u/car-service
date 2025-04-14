import { SyntheticEvent } from 'react';

import { useToasts } from '@/hooks/useToasts';

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
      className="border-alpha-grey-300 mx-auto block w-xs cursor-pointer overflow-x-auto rounded-md border py-2 text-center"
      defaultValue={id}
      placeholder="..."
      type="text"
      onClick={handleInputClick}
    />
  );
}
