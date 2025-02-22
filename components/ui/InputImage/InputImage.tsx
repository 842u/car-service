import { ComponentType, Ref, useRef } from 'react';
import { UseControllerProps } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { useInputImage } from '@/hooks/useInputImage';
import { getMimeTypeExtensions } from '@/utils/general';
import {
  IMAGE_FILE_ACCEPTED_MIME_TYPES,
  IMAGE_FILE_MAX_SIZE_BYTES,
} from '@/utils/validation';

import { AddCarFormValues } from '../AddCarForm/AddCarForm';

const acceptedFileTypes = getMimeTypeExtensions(IMAGE_FILE_ACCEPTED_MIME_TYPES);
const maxFileSize = IMAGE_FILE_MAX_SIZE_BYTES / (1024 * 1024);

type InputImageProps = UseControllerProps<AddCarFormValues> & {
  ref: Ref<InputImageRef>;
  label?: string;
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
  label,
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
    <div>
      <label
        className="flex flex-col items-center justify-center"
        htmlFor={props.name}
      >
        {label && <p className="self-start py-2 text-sm">{label}</p>}
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
          <div className="absolute z-20 h-full w-full cursor-pointer">
            <input
              ref={inputElementRef}
              accept={accept}
              className="invisible"
              id={props.name}
              type="file"
              onChange={fileChangeHandler}
            />
          </div>
        </div>
        {showErrorMessage && (
          <p className="text-error-400 my-1 text-sm whitespace-pre-wrap">
            {errorMessage || ' '}
          </p>
        )}
      </label>
      <div className="mb-5 text-sm">
        <p>Click on the image to upload a custom one.</p>
        <p className="text-alpha-grey-700">
          {`Accepted file types: ${acceptedFileTypes}.`}
        </p>
        <p className="text-alpha-grey-700">
          {`Max file size: ${maxFileSize}MB.`}
        </p>
      </div>
    </div>
  );
}
