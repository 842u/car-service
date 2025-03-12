'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/hooks/useToasts';
import { getMimeTypeExtensions } from '@/utils/general';
import { patchProfile } from '@/utils/supabase/general';
import {
  onErrorProfileQueryMutation,
  onMutateProfileQueryMutation,
} from '@/utils/tenstack/general';
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

  const { addToast } = useToasts();

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: (avatarFormData: AvatarFormValues) =>
      patchProfile({
        property: 'avatar_url',
        value: avatarFormData.avatarFile,
      }),
    onMutate: () => {
      if (fileInputRef.current?.imagePreviewUrl)
        return onMutateProfileQueryMutation(
          queryClient,
          'avatar_url',
          fileInputRef.current?.imagePreviewUrl,
        );
    },
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<AvatarFormValues>({
    mode: 'all',
    defaultValues: defaultAvatarFormValues,
  });

  const resetForm = () => {
    reset();
    fileInputRef.current?.reset();
  };

  const submitForm = async (avatarFormData: AvatarFormValues) => {
    await mutateAsync(avatarFormData, {
      onSuccess: () => {
        addToast('Avatar uploaded successfully.', 'success');
      },
      onError: (error, _, context) =>
        onErrorProfileQueryMutation(queryClient, error, context, addToast),
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        resetForm();
      },
    });
  };

  return (
    <form
      className="w-full md:flex md:gap-5"
      onSubmit={handleSubmit(submitForm)}
    >
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
            disabled={!isDirty || isSubmitting}
            onClick={() => resetForm()}
          >
            Reset
          </Button>
          <SubmitButton
            className="basis-1/2"
            disabled={!isValid || !isDirty || isSubmitting}
            isSubmitting={isSubmitting}
          >
            Save
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
