'use client';

import { AvatarFormValues } from '@/schemas/zod/avatarFormSchema';

import { AvatarImage } from '../AvatarImage/AvatarImage';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';
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
    <Form variant="raw" onSubmit={handleFormSubmit}>
      <Form.InputImage<AvatarFormValues>
        className="md:w-72"
        control={control}
        errorMessage={errors.image?.message}
        label="Avatar"
        name="image"
        withInfo={false}
        onChange={handleInputImageChange}
      >
        <AvatarImage src={inputImageUrl || avatarUrl} />
      </Form.InputImage>
      <Form.Controls>
        <Button disabled={!isDirty || isSubmitting} onClick={handleFormReset}>
          Reset
        </Button>
        <Form.ButtonSubmit
          disabled={!isValid || !isDirty || isSubmitting}
          isSubmitting={isSubmitting}
        >
          Save
        </Form.ButtonSubmit>
      </Form.Controls>
    </Form>
  );
}
