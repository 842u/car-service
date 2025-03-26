'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/hooks/useToasts';
import { Profile } from '@/types';
import { enqueueRevokeObjectUrl, getMimeTypeExtensions } from '@/utils/general';
import { patchProfile } from '@/utils/supabase/general';
import {
  onErrorProfileQueryMutation,
  onMutateProfileQueryMutation,
} from '@/utils/tanstack/general';
import {
  avatarFormSchema,
  AvatarFormValues,
  IMAGE_FILE_ACCEPTED_MIME_TYPES,
  IMAGE_FILE_MAX_SIZE_BYTES,
} from '@/utils/validation';

import { AvatarImage } from '../AvatarImage/AvatarImage';
import { Button } from '../Button/Button';
import { InputImage } from '../InputImage/InputImage';
import { SubmitButton } from '../SubmitButton/SubmitButton';

const acceptedFileTypes = getMimeTypeExtensions(IMAGE_FILE_ACCEPTED_MIME_TYPES);
const maxFileSize = IMAGE_FILE_MAX_SIZE_BYTES / (1024 * 1024);

const defaultAvatarFormValues: AvatarFormValues = {
  image: null,
};

type AvatarFormProps = {
  data?: Profile | null;
};

export function AvatarForm({ data }: AvatarFormProps) {
  const [inputImageUrl, setInputImageUrl] = useState<string | null>(null);

  const { addToast } = useToasts();

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    throwOnError: false,
    mutationFn: (avatarFormData: AvatarFormValues) =>
      patchProfile({
        property: 'avatar_url',
        value: avatarFormData.image,
      }),
    onMutate: () =>
      onMutateProfileQueryMutation(
        queryClient,
        'session',
        'avatar_url',
        inputImageUrl,
      ),
    onSuccess: () => {
      addToast('Avatar uploaded successfully.', 'success');
    },
    onError: (error, _, context) =>
      onErrorProfileQueryMutation(
        queryClient,
        'session',
        error,
        context,
        addToast,
      ),
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting, isSubmitSuccessful },
  } = useForm<AvatarFormValues>({
    resolver: zodResolver(avatarFormSchema),
    mode: 'onChange',
    defaultValues: defaultAvatarFormValues,
  });

  const submitForm = async (avatarFormData: AvatarFormValues) => {
    await mutateAsync(avatarFormData, {
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['profiles', 'session'] });
      },
    });
  };

  const handleInputImageChange = (file: File | undefined | null) => {
    inputImageUrl && enqueueRevokeObjectUrl(inputImageUrl);
    setInputImageUrl((file && URL.createObjectURL(file)) || null);
  };

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <form
      className="w-full md:flex md:gap-5"
      onSubmit={handleSubmit(submitForm)}
    >
      <InputImage<AvatarFormValues>
        className="md:basis-1/3"
        control={control}
        errorMessage={errors.image?.message}
        label="Avatar"
        name="image"
        withInfo={false}
        onChange={handleInputImageChange}
      >
        <AvatarImage src={inputImageUrl || data?.avatar_url} />
      </InputImage>
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
            onClick={() => reset()}
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
