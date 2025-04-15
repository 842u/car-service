import { SubmitButton } from '../SubmitButton/SubmitButton';
import { useCarDeleteForm } from './useCarDeleteForm';

export type CarDeleteFormProps = {
  carId: string;
  onSubmit: () => void;
};

export function CarDeleteForm({ carId, onSubmit }: CarDeleteFormProps) {
  const { handleFormSubmit } = useCarDeleteForm({ carId, onSubmit });

  return (
    <form
      className="border-accent-200 dark:border-accent-300 bg-light-500 dark:bg-dark-500 rounded-xl border-2 p-10"
      onSubmit={handleFormSubmit}
    >
      <h2>Delete a car</h2>
      <div className="bg-alpha-grey-200 my-4 h-[1px] w-full" />
      <p className="my-5">Are you sure you want permanently delete this car?</p>
      <SubmitButton className="mr-0 ml-auto">Delete</SubmitButton>
    </form>
  );
}
