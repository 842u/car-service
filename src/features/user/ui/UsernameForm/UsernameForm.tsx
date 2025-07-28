'use client';

import { Button } from '@/features/common/ui/button/button';

import { Form } from '../../../../features/common/ui/Form/Form';
import { useUsernameForm } from './useUsernameForm';

export const USERNAME_FORM_TEST_ID = 'username form test id';

type UsernameFormProps = {
  username?: string | null;
};

export function UsernameForm({ username }: UsernameFormProps) {
  const {
    handleFormSubmit,
    handleFormReset,
    errors,
    register,
    isDirty,
    isValid,
  } = useUsernameForm({ username });

  return (
    <Form
      data-testid={USERNAME_FORM_TEST_ID}
      variant="raw"
      onSubmit={handleFormSubmit}
    >
      <Form.InputWrapper>
        <Form.Input
          errorMessage={errors.username?.message}
          label="Username"
          name="username"
          placeholder="Enter your username"
          register={register}
          type="text"
        />
      </Form.InputWrapper>
      <Form.Controls className="flex flex-col gap-4 md:flex-row md:justify-end">
        <Button disabled={!isDirty} onClick={handleFormReset}>
          Reset
        </Button>
        <Form.ButtonSubmit disabled={!isValid || !isDirty}>
          Save
        </Form.ButtonSubmit>
      </Form.Controls>
    </Form>
  );
}
