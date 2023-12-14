'use client';

import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import {
  emailValidationRules,
  passwordValidationRules,
} from '@/utils/validation';

import { ToggleVisibilityButton } from '../ToggleVisibilityButton/ToggleVisibilityButton';

type AuthFormValues = {
  email: string;
  password: string;
};

export default function AuthForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, isValid, isSubmitting },
  } = useForm<AuthFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const passwordVisibilityHandler = () => {
    setIsPasswordVisible((currentState) => !currentState);
  };

  const submitHandler: SubmitHandler<AuthFormValues> = (data) => {
    console.log(data);
  };

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(submitHandler)}>
      <h1>Hello</h1>
      <label htmlFor="email">
        Email
        <input
          {...register('email', emailValidationRules)}
          id="email"
          placeholder="Enter your email ..."
          type="email"
        />
      </label>
      <div className="relative">
        <label htmlFor="password">
          Password
          <input
            {...register('password', passwordValidationRules)}
            id="password"
            placeholder="Enter your password ..."
            type={isPasswordVisible ? 'text' : 'password'}
          />
        </label>
        <ToggleVisibilityButton
          className="absolute h-full"
          isVisible={isPasswordVisible}
          onClick={passwordVisibilityHandler}
        />
      </div>
      <button
        className="disabled:text-light-darker"
        disabled={!isValid || isSubmitting}
        type="submit"
      >
        Sign In
      </button>
    </form>
  );
}
