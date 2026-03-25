'use client';

import type { ImageFormData } from '@/common/interface/ui/image-form.schema';
import { Button } from '@/ui/button/button';
import { Form } from '@/ui/form/form';
import { UserImage } from '@/user/presentation/ui/image/image';

import { useAvatarForm } from './use-avatar';

export const AVATAR_FORM_TEST_ID = 'avatar-form';

type AvatarFormProps = {
  avatarUrl?: string | null;
};

export function AvatarForm({ avatarUrl }: AvatarFormProps) {
  const {
    handleFormSubmit,
    handleFormReset,
    control,
    errors,
    isSubmitting,
    canReset,
    canSubmit,
  } = useAvatarForm();

  return (
    <Form
      data-testid={AVATAR_FORM_TEST_ID}
      variant="raw"
      onSubmit={handleFormSubmit}
    >
      <Form.InputWrapper className="mx-auto max-w-72 md:mx-0">
        <Form.InputImage<ImageFormData>
          control={control}
          errorMessage={errors.image?.message}
          label="Avatar"
          name="image"
          withInfo={false}
        >
          {(previewUrl) => <UserImage src={previewUrl || avatarUrl} />}
        </Form.InputImage>
      </Form.InputWrapper>
      <Form.Controls>
        <Button disabled={!canReset} onClick={handleFormReset}>
          Reset
        </Button>
        <Form.ButtonSubmit disabled={!canSubmit} isSubmitting={isSubmitting}>
          Save
        </Form.ButtonSubmit>
      </Form.Controls>
    </Form>
  );
}
