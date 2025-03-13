import {
  ChangeEvent,
  ComponentType,
  RefObject,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { ImageWithPreviewProps } from '@/types';
import { enqueueRevokeObjectUrl, getMimeTypeExtensions } from '@/utils/general';
import {
  IMAGE_FILE_ACCEPTED_MIME_TYPES,
  IMAGE_FILE_MAX_SIZE_BYTES,
} from '@/utils/validation';

const acceptedFileTypes = getMimeTypeExtensions(IMAGE_FILE_ACCEPTED_MIME_TYPES);
const maxFileSize = IMAGE_FILE_MAX_SIZE_BYTES / (1024 * 1024);

export type InputImageRef = {
  inputImageUrl: string | null;
};

type InputImageProps<T extends FieldValues> = UseControllerProps<T> & {
  ref?: RefObject<InputImageRef | null>;
  withInfo?: boolean;
  required?: boolean;
  label?: string;
  ImagePreviewComponent?: ComponentType<ImageWithPreviewProps>;
  className?: string;
  errorMessage?: string | undefined;
  showErrorMessage?: boolean;
};

export function InputImage<T extends FieldValues>({
  ref,
  label,
  name,
  control,
  rules,
  defaultValue,
  ImagePreviewComponent,
  className,
  errorMessage,
  withInfo = true,
  required = false,
  showErrorMessage = true,
}: InputImageProps<T>) {
  const [inputImageUrl, setInputImageUrl] = useState<string | null>(null);
  const inputElementRef = useRef<HTMLInputElement>(null);

  const { field } = useController({ name, control, rules, defaultValue });

  const hasBeenReset = !field.value && inputImageUrl;
  if (hasBeenReset) {
    inputImageUrl && enqueueRevokeObjectUrl(inputImageUrl);
    setInputImageUrl(null);
    if (inputElementRef.current?.files) {
      inputElementRef.current.files = new DataTransfer().files;
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    inputImageUrl && enqueueRevokeObjectUrl(inputImageUrl);
    setInputImageUrl((file && URL.createObjectURL(file)) || null);

    field.onChange(file);
  };

  useImperativeHandle(ref, () => ({ inputImageUrl }), [inputImageUrl]);

  return (
    <label className={className} htmlFor={name}>
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
          <ImagePreviewComponent previewUrl={inputImageUrl} />
        )}
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
