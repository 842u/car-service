import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  type ImageFormData,
  imageFormSchema,
} from '@/common/interface/ui/image-form.schema';
import { useUserAvatarChange } from '@/user/presentation/ui/forms/avatar/use-avatar-change';
import { enqueueRevokeObjectUrl } from '@/utils/general';

export const defaultAvatarFormValues: ImageFormData = {
  image: null,
};

export function useAvatarForm() {
  const [imageInputUrl, setImageInputUrl] = useState<string | null>(null);

  const { mutateAsync } = useUserAvatarChange();

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting, isSubmitSuccessful },
  } = useForm<ImageFormData>({
    resolver: zodResolver(imageFormSchema),
    mode: 'onChange',
    defaultValues: defaultAvatarFormValues,
  });

  const handleFormSubmit = handleSubmit(async (formData: ImageFormData) => {
    await mutateAsync({ image: formData.image, imageInputUrl });
  });

  const handleImageInputChange = (file: File | undefined | null) => {
    imageInputUrl && enqueueRevokeObjectUrl(imageInputUrl);
    setImageInputUrl((file && URL.createObjectURL(file)) || null);
  };

  const handleFormReset = () => reset();

  const canReset = isDirty && !isSubmitting;

  const canSubmit = isValid && isDirty && !isSubmitting;

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return {
    handleFormSubmit,
    handleImageInputChange,
    handleFormReset,
    control,
    errors,
    inputImageUrl: imageInputUrl,
    isSubmitting,
    canReset,
    canSubmit,
  };
}
