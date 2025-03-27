import { ChangeEvent, ReactNode, useEffect, useRef } from 'react';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

import {
  IMAGE_FILE_ACCEPTED_MIME_TYPES,
  IMAGE_FILE_MAX_SIZE_BYTES,
} from '@/schemas/zod/common';
import { getMimeTypeExtensions } from '@/utils/general';

const acceptedFileTypes = getMimeTypeExtensions(IMAGE_FILE_ACCEPTED_MIME_TYPES);
const maxFileSize = IMAGE_FILE_MAX_SIZE_BYTES / (1024 * 1024);

export type InputImageRef = {
  inputImageUrl: string | null;
};

type InputImageProps<T extends FieldValues> = UseControllerProps<T> & {
  onChange?: (file: File | undefined | null) => void;
  withInfo?: boolean;
  required?: boolean;
  label?: string;
  children?: ReactNode;
  className?: string;
  errorMessage?: string | undefined;
  showErrorMessage?: boolean;
};

export function InputImage<T extends FieldValues>({
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
}: InputImageProps<T>) {
  const inputElementRef = useRef<HTMLInputElement>(null);

  const { field } = useController({ name, control, rules, defaultValue });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onChange && onChange(file);
    field.onChange(file);
  };

  useEffect(() => {
    if (!field.value) {
      if (inputElementRef.current?.files) {
        inputElementRef.current.files = new DataTransfer().files;
      }
      field.onChange(null);
      onChange && onChange(null);
    }
  }, [field, onChange]);

  return (
    <label className={className} htmlFor={name}>
      {label && (
        <p className="self-start pb-2 text-sm">
          <span>{label}</span>
          {required && <span className="text-error-300 mx-1">*</span>}
        </p>
      )}
      <div
        className={`${
          errorMessage
            ? 'border-error-500 focus:border-error-500 bg-light-600 dark:bg-dark-700 relative aspect-square w-full cursor-pointer overflow-clip rounded-lg border'
            : 'border-alpha-grey-400 bg-light-600 dark:bg-dark-700 relative aspect-square w-full cursor-pointer overflow-clip rounded-lg border'
        }`}
      >
        <div
          aria-hidden
          className={`${errorMessage ? 'bg-error-500/20 dark:bg-error-500/20 absolute z-10 h-full w-full' : 'hidden'}`}
        />
        {children}
        <input
          ref={inputElementRef}
          accept={IMAGE_FILE_ACCEPTED_MIME_TYPES.join(', ')}
          className="invisible absolute"
          id={name}
          name={name}
          type="file"
          onChange={handleFileChange}
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
