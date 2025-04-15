'use client';

import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { SubmitButton } from '@/components/ui/SubmitButton/SubmitButton';

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
    <form
      className="items-center justify-between lg:flex"
      onSubmit={handleFormSubmit}
    >
      <div className="lg:w-1/3 lg:p-4">
        <Input
          errorMessage={errors.username?.message}
          label="Username"
          name="username"
          placeholder="Enter your username"
          register={register}
          type="text"
        />
      </div>
      <div className="w-full flex-1">
        <div className="my-4 flex justify-center gap-4">
          <Button
            className="flex-1"
            disabled={!isDirty}
            onClick={handleFormReset}
          >
            Reset
          </Button>
          <SubmitButton className="flex-1" disabled={!isValid || !isDirty}>
            Save
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
