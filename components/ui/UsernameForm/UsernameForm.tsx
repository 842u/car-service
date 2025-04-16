'use client';

import { Button } from '@/components/ui/Button/Button';

import { Form } from '../Form/Form';
import { useUsernameForm } from './useUsernameForm';

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
    <Form variant="raw" onSubmit={handleFormSubmit}>
      <Form.Input
        className="md:w-fit"
        errorMessage={errors.username?.message}
        label="Username"
        name="username"
        placeholder="Enter your username"
        register={register}
        type="text"
      />
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
