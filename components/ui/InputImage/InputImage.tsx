import { ComponentType, Ref, useRef } from 'react';
import { UseControllerProps } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { useInputImage } from '@/hooks/useInputImage';

import { AddCarFormValues } from '../AddCarForm/AddCarForm';

type InputImageProps = UseControllerProps<AddCarFormValues> & {
  ref: Ref<InputImageRef>;
  ImagePreviewComponent?: ComponentType<{ className?: string; src?: string }>;
  accept?: string;
  className?: string;
  errorMessage?: string | undefined;
  showErrorMessage?: boolean;
};

export type InputImageRef = {
  reset: () => void;
};

export function InputImage({
  ref,
  ImagePreviewComponent,
  accept,
  className,
  errorMessage,
  showErrorMessage = true,
  ...props
}: InputImageProps) {
  const inputElementRef = useRef<HTMLInputElement>(null);

  const { fileChangeHandler, imagePreviewUrl } =
    useInputImage<AddCarFormValues>(ref, inputElementRef, props);

  return (
    <>
      <div
        className={twMerge(
          'relative',
          className,
          errorMessage
            ? 'border-error-500 focus:border-error-500 border-2'
            : '',
        )}
      >
        {errorMessage && (
          <div className="bg-error-500/10 absolute z-10 h-full w-full" />
        )}
        {ImagePreviewComponent && (
          <ImagePreviewComponent
            className="absolute h-full w-full"
            src={imagePreviewUrl}
          />
        )}
        <label
          className="absolute z-20 h-full w-full cursor-pointer"
          htmlFor={props.name}
        >
          <input
            ref={inputElementRef}
            accept={accept}
            className="invisible"
            id={props.name}
            type="file"
            onChange={fileChangeHandler}
          />
        </label>
      </div>
      {showErrorMessage && (
        <p className="text-error-400 my-1 text-sm whitespace-pre-wrap">
          {errorMessage || ' '}
        </p>
      )}
    </>
  );
}
