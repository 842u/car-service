import { InputVariants } from '@/types';

const baseClassName = 'border rounded-md w-full h-10 px-3';

const defaultClassName = `${baseClassName} border-alpha-grey-200 bg-alpha-grey-50`;

const transparentClassName = `${baseClassName} border-alpha-grey-200`;

const errorClassName = `${baseClassName} border-error-500 bg-error-500/50`;

export const inputVariants: Record<InputVariants, string> = {
  default: defaultClassName,
  transparent: transparentClassName,
  error: errorClassName,
};
