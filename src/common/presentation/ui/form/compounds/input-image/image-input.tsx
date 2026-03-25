import type { ReactNode } from 'react';
import type { FieldValues, UseControllerProps } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import {
  IMAGE_FILE_ACCEPTED_MIME_TYPES,
  MAX_IMAGE_FILE_SIZE_BYTES,
} from '@/common/interface/schema/image-file.schema';
import { inputVariants } from '@/lib/tailwindcss/input';
import { getMimeTypeExtensions } from '@/lib/utils';

import { InputErrorText } from '../input/error-text/error-text';
import { InputLabelText } from '../input/label-text/label-text';
import { useFormImageInput } from './use-image-input';

export const FORM_IMAGE_INPUT_TEST_ID = 'form-image-input';

const acceptedFileTypes = getMimeTypeExtensions(IMAGE_FILE_ACCEPTED_MIME_TYPES);
const maxFileSize = MAX_IMAGE_FILE_SIZE_BYTES / (1024 * 1024);

export type FormImageInputProps<T extends FieldValues> =
  UseControllerProps<T> & {
    onChange?: (file: File | undefined | null) => void;
    withInfo?: boolean;
    required?: boolean;
    label?: string;
    children?: (previewUrl: string | null) => ReactNode;
    className?: string;
    errorMessage?: string | undefined;
    showErrorMessage?: boolean;
  };

/**
 * FormImageInput is a reusable file input for images integrated with React Hook
 * Form.
 *
 * @template T - The type of the form values managed by React Hook Form.
 *
 * @remarks
 * This component uses a render prop pattern for `children`:
 * - `children` is a function that receives the internal `previewUrl` generated
 *   from the selected file.
 * - This allows the parent component to decide how to render the selected image
 *   without coupling the input logic to a specific UI (e.g., <UserImage />).
 *
 * Example usage:
 * - <FormImageInput name="image" control={control}> {(previewUrl) => <UserImage
 *   src={previewUrl || avatarUrl} />} </FormImageInput>
 */
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
  const { handleFileChange, previewUrl } = useFormImageInput({
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
          accept={IMAGE_FILE_ACCEPTED_MIME_TYPES.join(', ')}
          className="sr-only absolute"
          data-testid={FORM_IMAGE_INPUT_TEST_ID}
          name={name}
          type="file"
          onChange={handleFileChange}
        />
        {children?.(previewUrl)}
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
