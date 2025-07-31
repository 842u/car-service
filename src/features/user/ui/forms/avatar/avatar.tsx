'use client';

import { AvatarFormValues } from '@/schemas/zod/avatarFormSchema';
import { Button } from '@/ui/button/button';
import { Form } from '@/ui/form/form';
import { UserImage } from '@/user/ui/image/image';

import { useAvatarForm } from './use-avatar';

export const AVATAR_FORM_TEST_ID = 'avatar-form';

type AvatarFormProps = {
  avatarUrl?: string | null;
};

export function AvatarForm({ avatarUrl }: AvatarFormProps) {
  const {
    inputImageUrl,
    handleFormSubmit,
    handleImageInputChange,
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
          onChange={handleImageInputChange}
        >
          <UserImage src={inputImageUrl || avatarUrl} />
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
