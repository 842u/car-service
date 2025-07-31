import type { ReactNode } from 'react';
import type { FieldValues, UseControllerProps } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import {
  IMAGE_FILE_ACCEPTED_MIME_TYPES,
  IMAGE_FILE_MAX_SIZE_BYTES,
} from '@/schemas/zod/common';
import { getMimeTypeExtensions } from '@/utils/general';
import { inputVariants } from '@/utils/tailwindcss/input';

import { InputErrorText } from '../input/error-text/error-text';
import { InputLabelText } from '../input/label-text/label-text';
import { useFormImageInput } from './use-image-input';

export const FORM_IMAGE_INPUT_TEST_ID = 'form-image-input';

const acceptedFileTypes = getMimeTypeExtensions(IMAGE_FILE_ACCEPTED_MIME_TYPES);
const maxFileSize = IMAGE_FILE_MAX_SIZE_BYTES / (1024 * 1024);

export type FormImageInputRef = {
  inputImageUrl: string | null;
};

export type FormImageInputProps<T extends FieldValues> =
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

export function FormImageInput<T extends FieldValues>({
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
}: FormImageInputProps<T>) {
  const { handleFileChange, inputElementRef } = useFormImageInput({
    name,
    control,
    defaultValue,
    onChange,
    rules,
  });

  return (
    <label>
      {label && <InputLabelText required={required} text={label} />}
      <div
        className={twMerge(
          errorMessage ? inputVariants['error'] : inputVariants['default'],
          'relative my-1 aspect-square h-auto w-full cursor-pointer overflow-clip p-0',
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
          data-testid={FORM_IMAGE_INPUT_TEST_ID}
          name={name}
          type="file"
          onChange={handleFileChange}
        />
        {children}
      </div>
      {showErrorMessage && <InputErrorText errorMessage={errorMessage} />}
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
