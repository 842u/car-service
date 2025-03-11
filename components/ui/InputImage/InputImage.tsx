import { ComponentType, Ref, useRef } from 'react';
import { FieldValues, UseControllerProps } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { useInputImage } from '@/hooks/useInputImage';
import { ImageWithPreviewProps } from '@/types';
import { getMimeTypeExtensions } from '@/utils/general';
import {
  IMAGE_FILE_ACCEPTED_MIME_TYPES,
  IMAGE_FILE_MAX_SIZE_BYTES,
} from '@/utils/validation';

const acceptedFileTypes = getMimeTypeExtensions(IMAGE_FILE_ACCEPTED_MIME_TYPES);
const maxFileSize = IMAGE_FILE_MAX_SIZE_BYTES / (1024 * 1024);

type InputImageProps<T extends FieldValues> = UseControllerProps<T> & {
  ref: Ref<InputImageRef>;
  onCancel?: () => void;
  withInfo?: boolean;
  required?: boolean;
  label?: string;
  ImagePreviewComponent?: ComponentType<ImageWithPreviewProps>;
  className?: string;
  errorMessage?: string | undefined;
  showErrorMessage?: boolean;
};

export type InputImageRef = {
  reset: () => void;
};

export function InputImage<T extends FieldValues>({
  ref,
  label,
  ImagePreviewComponent,
  className,
  errorMessage,
  withInfo = true,
  required = false,
  showErrorMessage = true,
  onCancel,
  ...props
}: InputImageProps<T>) {
  const inputElementRef = useRef<HTMLInputElement>(null);

  const { fileChangeHandler, imagePreviewUrl } = useInputImage<T>(
    ref,
    inputElementRef,
    props,
    onCancel,
  );

  return (
    <label className={className} htmlFor={props.name}>
      {label && (
        <p className="self-start pb-2 text-sm">
          <span>{label}</span>
          {required && <span className="text-error-300 mx-1">*</span>}
        </p>
      )}
      <div
        className={twMerge(
          'border-alpha-grey-400 bg-light-600 dark:bg-dark-700 relative aspect-square w-full cursor-pointer overflow-clip rounded-lg border',
          errorMessage
            ? 'border-error-500 focus:border-error-500 bg-error-500/10 dark:bg-error-500/10'
            : '',
        )}
      >
        {ImagePreviewComponent && (
          <ImagePreviewComponent previewUrl={imagePreviewUrl} />
        )}
        <input
          ref={inputElementRef}
          accept={IMAGE_FILE_ACCEPTED_MIME_TYPES.join(', ')}
          className="invisible absolute"
          id={props.name}
          type="file"
          onChange={fileChangeHandler}
        />
      </div>
      {showErrorMessage && (
        <p className="text-error-400 my-1 text-sm whitespace-pre-wrap">
          {errorMessage || ' '}
        </p>
      )}
      {withInfo && (
        <div className="mb-5 text-sm">
          <p>Click on the image to upload a custom one.</p>
          <p className="text-alpha-grey-700">
            {`Accepted file types: ${acceptedFileTypes}.`}
          </p>
          <p className="text-alpha-grey-700">
            {`Max file size: ${maxFileSize}MB.`}
          </p>
        </div>
      )}
    </label>
  );
}
