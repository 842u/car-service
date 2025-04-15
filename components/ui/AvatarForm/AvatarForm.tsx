'use client';

import { AvatarFormValues } from '@/schemas/zod/avatarFormSchema';

import { AvatarImage } from '../AvatarImage/AvatarImage';
import { Button } from '../Button/Button';
import { InputImage } from '../InputImage/InputImage';
import { SubmitButton } from '../SubmitButton/SubmitButton';
import { useAvatarForm } from './useAvatarForm';

type AvatarFormProps = {
  avatarUrl?: string | null;
};

export function AvatarForm({ avatarUrl }: AvatarFormProps) {
  const {
    inputImageUrl,
    handleFormSubmit,
    handleInputImageChange,
    handleFormReset,
    control,
    errors,
    isDirty,
    isSubmitting,
    isValid,
  } = useAvatarForm();

  return (
    <form className="w-full md:flex md:gap-5" onSubmit={handleFormSubmit}>
      <InputImage<AvatarFormValues>
        className="md:basis-1/3"
        control={control}
        errorMessage={errors.image?.message}
        label="Avatar"
        name="image"
        withInfo={false}
        onChange={handleInputImageChange}
      >
        <AvatarImage src={inputImageUrl || avatarUrl} />
      </InputImage>
      <div className="md:flex md:basis-2/3 md:flex-col md:justify-evenly">
        <div className="flex gap-5">
          <Button
            className="basis-1/2"
            disabled={!isDirty || isSubmitting}
            onClick={handleFormReset}
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
