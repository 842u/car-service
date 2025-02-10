import { useContext, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { SettingsSection } from '@/components/ui/SettingsSection/SettingsSection';
import { SubmitButton } from '@/components/ui/SubmitButton/SubmitButton';
import { ToastsContext } from '@/context/ToastsContext';
import { UserProfileContext } from '@/context/UserProfileContext';
import { fetchUserProfile } from '@/utils/general';
import { createClient } from '@/utils/supabase/client';
import { usernameValidationRules } from '@/utils/validation';

type UsernameFormValues = {
  username: string;
};
export function UsernameSection() {
  const {
    userProfile: { username, id },
    setUserProfile,
  } = useContext(UserProfileContext);
  const { addToast } = useContext(ToastsContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, isDirty, errors },
  } = useForm<UsernameFormValues>({
    mode: 'onChange',
    defaultValues: {
      username: '',
    },
  });

  const submitHandler: SubmitHandler<UsernameFormValues> = async (data) => {
    const newUsername = data.username.trim();

    setUserProfile((currentState) => ({
      ...currentState,
      username: newUsername,
    }));

    const supabase = createClient();

    const { error } = await supabase
      .from('profiles')
      .update({ username: newUsername })
      .eq('id', id);

    if (error) {
      const profileData = await fetchUserProfile();
      setUserProfile((previousState) => ({ ...previousState, ...profileData }));

      addToast(
        'Something went wrong while updating profile username. Try again.',
        'error',
      );
      return;
    }

    addToast('Username changed successfully.', 'success');
  };

  useEffect(() => {
    reset({ username: username || '' });
  }, [reset, username]);

  return (
    <SettingsSection headingText="Username">
      <form
        className="items-center justify-between lg:flex"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className="lg:w-1/3 lg:p-4">
          <Input
            errorMessage={errors.username?.message}
            label="Username"
            name="username"
            placeholder="Enter your username"
            register={register}
            registerOptions={usernameValidationRules}
            showErrorMessage={false}
            type="text"
          />
        </div>
        <div className="w-full flex-1">
          <div className="text-sm">
            <p>
              Please enter your full name, or a display name you are comfortable
              with.
            </p>
            <p className="text-alpha-grey-700">
              {`Letters, numbers and single whitespaces allowed. Length between
              ${usernameValidationRules.minLength.value} and
              ${usernameValidationRules.maxLength.value} characters.`}
            </p>
          </div>
          <div className="my-4 flex justify-center gap-4">
            <SubmitButton
              className="flex-1"
              disabled={isSubmitting || !isValid || !isDirty}
            >
              Save
            </SubmitButton>
            <Button
              className="flex-1"
              disabled={isSubmitting || !isDirty}
              onClick={() => {
                reset({ username: username || '' });
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </SettingsSection>
  );
}
