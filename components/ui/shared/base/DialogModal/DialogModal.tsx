import {
  ComponentPropsWithoutRef,
  Ref,
  SyntheticEvent,
  useImperativeHandle,
  useRef,
} from 'react';

import { XCircleIcon } from '@/components/decorative/icons/XCircleIcon';

import { IconButton } from '../../IconButton/IconButton';

export type DialogModalRef = {
  showModal: () => void;
  closeModal: () => void;
};

type DialogModalProps = ComponentPropsWithoutRef<'dialog'> & {
  headingText: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  ref?: Ref<DialogModalRef>;
};

export function DialogModal({
  headingText,
  children,
  ref,
  headingLevel = 'h2',
  ...props
}: DialogModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => {
    return {
      showModal() {
        dialogRef.current?.showModal();
      },
      closeModal,
    };
  }, []);

  const HeadingTag = headingLevel;

  const closeModal = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      className="bg-light-500 dark:bg-dark-500 border-accent-200 dark:border-accent-300 fixed m-auto w-full rounded-md border p-4 backdrop:backdrop-blur-xs md:w-fit"
      onClick={closeModal}
      {...props}
    >
      <div
        // Prevent dialog closing while clicking on its content
        onClick={(event: SyntheticEvent<HTMLDivElement>) => {
          event.stopPropagation();
        }}
      >
        <div className="flex items-end justify-between">
          <HeadingTag className="inline-block text-xl">
            {headingText}
          </HeadingTag>
          <IconButton className="p-1" title="close" onClick={closeModal}>
            <XCircleIcon className="stroke-dark-500 dark:stroke-light-500 h-full w-full stroke-2" />
          </IconButton>
        </div>
        <div className="bg-alpha-grey-200 my-4 h-[1px] w-full" />
        {children}
      </div>
    </dialog>
  );
}
