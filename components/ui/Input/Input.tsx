'use client';

import { HTMLInputTypeAttribute, useState } from 'react';
import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { ToggleVisibilityButton } from '../ToggleVisibilityButton/ToggleVisibilityButton';

type InputProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  label: string;
  name: Path<T>;
  type: HTMLInputTypeAttribute;
  registerOptions?: RegisterOptions<T>;
  placeholder?: string;
  errorMessage?: string | undefined;
  showErrorMessage?: boolean;
};

export function Input<T extends FieldValues>({
  register,
  label,
  name,
  type,
  placeholder,
  registerOptions,
  errorMessage,
  showErrorMessage = true,
}: InputProps<T>) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(
    type !== 'password' || false,
  );

  const passwordVisibilityHandler = () => {
    setIsPasswordVisible((currentState) => !currentState);
  };

  return (
    <label className="text-sm" htmlFor={name}>
      {label}
      <div className="relative">
        <input
          className={twMerge(
            'border-alpha-grey-300 bg-light-600 placeholder:text-light-900 focus:border-alpha-grey-500 focus:ring-alpha-grey-700 dark:bg-dark-700 mt-2 block w-full rounded-md border px-4 py-2 placeholder:text-sm',
            errorMessage
              ? 'border-error-500 bg-error-200 focus:border-error-500 dark:bg-error-900'
              : '',
          )}
          id={name}
          placeholder={placeholder}
          type={
            type === 'password'
              ? isPasswordVisible
                ? 'text'
                : 'password'
              : type
          }
          {...register(name, registerOptions)}
        />
        {type === 'password' && (
          <div className="absolute top-0 right-0 mr-2 flex h-full flex-col justify-center">
            <ToggleVisibilityButton
              isVisible={isPasswordVisible}
              onClick={passwordVisibilityHandler}
            />
          </div>
        )}
      </div>
      {showErrorMessage && (
        <p className="text-error-400 my-1 text-sm whitespace-pre-wrap">
          {errorMessage || ' '}
        </p>
      )}
    </label>
  );
}
