'use client';

import type { ComponentProps } from 'react';
import { useId, useState } from 'react';
import type {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import type { InputVariants } from '@/ui/variants/input';
import { inputVariants } from '@/ui/variants/input';
import { VisibilityButton } from '@/ui/visibility-button/visibility-button';

import { useForm } from '../../use-form';
import { InputErrorText } from '../input/error-text/error-text';
import { InputLabelText } from '../input/label-text/label-text';

export type FormPasswordInputProps<TFieldValues extends FieldValues> = Omit<
  ComponentProps<'input'>,
  'type'
> & {
  label: string;
  name: Path<TFieldValues>;
  register?: UseFormRegister<TFieldValues>;
  variant?: InputVariants;
  required?: boolean;
  registerOptions?: RegisterOptions<TFieldValues>;
  errorMessage?: string | undefined;
  showErrorMessage?: boolean;
};

export function FormPasswordInput<TFieldValues extends FieldValues>({
  register,
  label,
  name,
  registerOptions,
  errorMessage,
  className,
  variant = 'default',
  showErrorMessage = true,
  required = false,
  ...props
}: FormPasswordInputProps<TFieldValues>) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  useForm();

  const errorId = useId();

  const handleVisibilityButtonClick = () => {
    setPasswordVisible((currentState) => !currentState);
  };

  return (
    <label>
      <InputLabelText required={required} text={label} />
      <div
        className={twMerge(
          errorMessage ? inputVariants['error'] : inputVariants[variant],
          'my-1 flex items-center p-0',
          'wrapper-focus-outline',
          className,
        )}
      >
        <input
          aria-describedby={
            errorMessage && showErrorMessage ? errorId : undefined
          }
          aria-invalid={Boolean(errorMessage) || undefined}
          className="inline-block h-full w-full pl-3"
          required={required}
          type={passwordVisible ? 'text' : 'password'}
          {...props}
          {...(register ? register(name, registerOptions) : {})}
        />
        {/*
          Load-bearing, not decorative padding. The field suppresses the ring
          of its own direct children, so nesting the toggle one level down is
          what leaves it drawing a ring of its own. Flatten this and tabbing
          from the input to the toggle stops moving the indicator.
        */}
        <div className="inline-block h-full p-1">
          <VisibilityButton
            className="h-full w-full px-1 py-0"
            isVisible={passwordVisible}
            onClick={handleVisibilityButtonClick}
          />
        </div>
      </div>
      {showErrorMessage && (
        <InputErrorText errorMessage={errorMessage} id={errorId} />
      )}
    </label>
  );
}
