'use client';

import { AvatarFormValues } from '@/schemas/zod/avatarFormSchema';

import { AvatarImage } from '../../images/AvatarImage/AvatarImage';
import { Button } from '../../shared/base/Button/Button';
import { Form } from '../../shared/base/Form/Form';
import { useAvatarForm } from './useAvatarForm';

export const AVATAR_FORM_TEST_ID = 'avatar form test id';

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
    <Form
      data-testid={AVATAR_FORM_TEST_ID}
      variant="raw"
      onSubmit={handleFormSubmit}
    >
      <Form.InputWrapper>
        <Form.InputImage<AvatarFormValues>
          control={control}
          errorMessage={errors.image?.message}
          label="Avatar"
          name="image"
          withInfo={false}
          onChange={handleInputImageChange}
        >
          <AvatarImage src={inputImageUrl || avatarUrl} />
        </Form.InputImage>
      </Form.InputWrapper>
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
