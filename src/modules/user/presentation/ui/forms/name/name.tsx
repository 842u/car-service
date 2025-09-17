'use client';

import { Button } from '@/ui/button/button';
import { Form } from '@/ui/form/form';

import { useNameForm } from './use-name';

export const NAME_FORM_TEST_ID = 'name-form';

type NameFormProps = {
  name?: string | null;
};

export function NameForm({ name }: NameFormProps) {
  const {
    handleFormSubmit,
    handleFormReset,
    errors,
    register,
    isDirty,
    isValid,
  } = useNameForm({ name });

  return (
    <Form
      data-testid={NAME_FORM_TEST_ID}
      variant="raw"
      onSubmit={handleFormSubmit}
    >
      <Form.InputWrapper>
        <Form.Input
          errorMessage={errors.name?.message}
          label="Name"
          name="name"
          placeholder="Enter your name"
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
