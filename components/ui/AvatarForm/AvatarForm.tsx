'use client';

import { useRef } from 'react';
import { useForm } from 'react-hook-form';

import { getMimeTypeExtensions } from '@/utils/general';
import {
  IMAGE_FILE_ACCEPTED_MIME_TYPES,
  IMAGE_FILE_MAX_SIZE_BYTES,
  imageFileValidationRules,
} from '@/utils/validation';

import { AvatarImageWithPreview } from '../AvatarImageWithPreview/AvatarImagePreview';
import { Button } from '../Button/Button';
import { InputImage, InputImageRef } from '../InputImage/InputImage';
import { SubmitButton } from '../SubmitButton/SubmitButton';

type AvatarFormValues = {
  avatarFile: File | null;
};

const acceptedFileTypes = getMimeTypeExtensions(IMAGE_FILE_ACCEPTED_MIME_TYPES);
const maxFileSize = IMAGE_FILE_MAX_SIZE_BYTES / (1024 * 1024);

const defaultAvatarFormValues = {
  avatarFile: null,
};

export function AvatarForm() {
  const fileInputRef = useRef<InputImageRef>(null);

  const {
    control,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<AvatarFormValues>({
    mode: 'onChange',
    defaultValues: defaultAvatarFormValues,
  });

  const resetForm = () => {
    reset();
    fileInputRef.current?.reset();
  };

  return (
    <form className="w-full md:flex md:gap-5">
      <InputImage<AvatarFormValues>
        ref={fileInputRef}
        className="md:basis-1/3"
        control={control}
        errorMessage={errors.avatarFile?.message}
        ImagePreviewComponent={AvatarImageWithPreview}
        label="Avatar"
        name="avatarFile"
        rules={imageFileValidationRules}
        withInfo={false}
        onCancel={resetForm}
      />
      <div className="md:flex md:basis-2/3 md:flex-col md:justify-evenly">
        <div className="my-4 text-sm">
          <p>Click on the image to upload a custom one.</p>
          <p className="text-alpha-grey-700">
            {`Accepted file types: ${acceptedFileTypes}.`}
          </p>
          <p className="text-alpha-grey-700">
            {`Max file size: ${maxFileSize}MB.`}
          </p>
        </div>
        <div className="flex gap-5">
          <Button
            className="basis-1/2"
            disabled={!isDirty}
            onClick={() => resetForm()}
          >
            Reset
          </Button>
          <SubmitButton className="basis-1/2" disabled={!isValid || !isDirty}>
            Save
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
