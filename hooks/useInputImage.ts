import {
  ChangeEvent,
  Ref,
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

import { InputImageRef } from '@/components/ui/InputImage/InputImage';

export function useInputImage<T extends FieldValues>(
  exposedRef: Ref<InputImageRef>,
  inputElementRef: RefObject<HTMLInputElement | null>,
  props: UseControllerProps<T>,
  onCancel?: () => void,
) {
  const [inputFile, setInputFile] = useState<File>();
  const inputFileUrl = useRef<string>(undefined);

  const { field } = useController(props);

  inputFileUrl.current && URL.revokeObjectURL(inputFileUrl.current);
  inputFileUrl.current = inputFile && URL.createObjectURL(inputFile);

  const fileChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length === 0 && onCancel) {
      onCancel();
    }

    const file = event.target.files?.[0];

    inputFileUrl.current && URL.revokeObjectURL(inputFileUrl.current);
    inputFileUrl.current = file && URL.createObjectURL(file);

    field.onChange(file);
    setInputFile(file);
  };

  useImperativeHandle(exposedRef, () => ({
    reset() {
      if (inputElementRef.current) {
        inputElementRef.current.files = new DataTransfer().files;
      }
      if (inputFileUrl.current) {
        URL.revokeObjectURL(inputFileUrl.current);
      }
      setInputFile(undefined);
    },
  }));

  return {
    imagePreviewUrl: inputFileUrl.current,
    fileChangeHandler,
  };
}
