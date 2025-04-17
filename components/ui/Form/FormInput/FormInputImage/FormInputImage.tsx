import { ReactNode } from 'react';
import { FieldValues, UseControllerProps } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import {
  IMAGE_FILE_ACCEPTED_MIME_TYPES,
  IMAGE_FILE_MAX_SIZE_BYTES,
} from '@/schemas/zod/common';
import { getMimeTypeExtensions } from '@/utils/general';

import { FormInputLabelText } from '../FormInputLabelText';
import { useFormInputImage } from './useFormInputImage';

const acceptedFileTypes = getMimeTypeExtensions(IMAGE_FILE_ACCEPTED_MIME_TYPES);
const maxFileSize = IMAGE_FILE_MAX_SIZE_BYTES / (1024 * 1024);

export type FormInputImageRef = {
  inputImageUrl: string | null;
};

export type FormInputImageProps<T extends FieldValues> =
  UseControllerProps<T> & {
    onChange?: (file: File | undefined | null) => void;
    withInfo?: boolean;
    required?: boolean;
    label?: string;
    children?: ReactNode;
    className?: string;
    errorMessage?: string | undefined;
    showErrorMessage?: boolean;
  };

const errorClassName =
  'border-error-500 bg-light-600 dark:bg-dark-700 relative aspect-square w-full cursor-pointer overflow-clip rounded-md border mt-1';

const defaultClassName =
  'border-alpha-grey-400 bg-light-600 dark:bg-dark-700 relative aspect-square w-full cursor-pointer overflow-clip rounded-md border mt-1';

export function FormInputImage<T extends FieldValues>({
  onChange,
  label,
  name,
  control,
  rules,
  defaultValue,
  children,
  className,
  errorMessage,
  withInfo = true,
  required = false,
  showErrorMessage = true,
}: FormInputImageProps<T>) {
  const { handleFileChange, inputElementRef } = useFormInputImage({
    name,
    control,
    defaultValue,
    onChange,
    rules,
  });

  return (
    <label htmlFor={name}>
      {label && <FormInputLabelText required={required} text={label} />}
      <div
        className={twMerge(
          errorMessage ? errorClassName : defaultClassName,
          className,
        )}
      >
        <div
          // Error image overlay
          aria-hidden
          className={`${errorMessage ? 'bg-error-500/20 dark:bg-error-500/20 absolute z-10 h-full w-full' : 'hidden'}`}
        />
        <input
          ref={inputElementRef}
          accept={IMAGE_FILE_ACCEPTED_MIME_TYPES.join(', ')}
          className="sr-only absolute"
          id={name}
          name={name}
          type="file"
          onChange={handleFileChange}
        />
        {children}
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
