import { useForm } from 'react-hook-form';
import { ZodError } from 'zod';

import { validateUserId } from '@/utils/validation';

import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { SubmitButton } from '../SubmitButton/SubmitButton';

type NewCarOwnerFormValues = {
  newOwnerId: string | null;
};

const defaultNewCarOwnerFormValues: NewCarOwnerFormValues = {
  newOwnerId: null,
};

export function NewCarOwnerForm() {
  const {
    register,
    reset,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm({
    mode: 'onChange',
    defaultValues: defaultNewCarOwnerFormValues,
  });

  return (
    <form className="border-accent-200 dark:border-accent-300 bg-light-500 dark:bg-dark-500 rounded-xl border-2 p-10">
      <h2>Add new car owner</h2>
      <div className="bg-alpha-grey-200 my-4 h-[1px] w-full" />
      <Input
        required
        errorMessage={errors.newOwnerId?.message}
        label="User ID"
        maxLength={36}
        minLength={36}
        name="newOwnerId"
        register={register}
        registerOptions={{
          validate: (data) => {
            try {
              validateUserId(data);
              return true;
            } catch (error) {
              if (error instanceof ZodError) return error.issues[0].message;
              if (error instanceof Error) return error.message;
            }
          },
        }}
        type="text"
      />
      <div className="mt-5 flex justify-evenly">
        <Button disabled={!isDirty} onClick={() => reset()}>
          Reset
        </Button>
        <SubmitButton
          disabled={!isValid || isSubmitting}
          isSubmitting={isSubmitting}
        >
          Save
        </SubmitButton>
      </div>
    </form>
  );
}
