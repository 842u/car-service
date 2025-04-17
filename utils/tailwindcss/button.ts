import { ButtonVariants } from '@/types';

const baseClassName =
  'cursor-pointer rounded-md border disabled:cursor-not-allowed text-center block disabled:text-light-800 transition-colors h-10';

const defaultClassName = `${baseClassName} border-alpha-grey-500 bg-alpha-grey-200 disabled:bg-alpha-grey-50 disabled:border-alpha-grey-100 hover:border-alpha-grey-600 hover:bg-alpha-grey-500`;

const accentClassName = `${baseClassName} border-accent-500 bg-accent-800 disabled:bg-accent-900 disabled:border-accent-800 hover:border-accent-300 hover:bg-accent-700 text-light-500`;

const transparentClassName = `${baseClassName} hover:bg-alpha-grey-200 border-0`;

const errorClassName = `${baseClassName} border-error-500 bg-error-700 disabled:bg-error-900 disabled:border-error-800 hover:border-error-300 hover:bg-error-600 text-light-500`;

export const buttonVariants: Record<ButtonVariants, string> = {
  default: defaultClassName,
  accent: accentClassName,
  transparent: transparentClassName,
  error: errorClassName,
};
