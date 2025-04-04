import { ButtonVariants } from '@/types';

const defaultClassName =
  'border-alpha-grey-500 bg-alpha-grey-200 disabled:bg-alpha-grey-50 disabled:border-alpha-grey-100 hover:border-alpha-grey-600 hover:bg-alpha-grey-500 cursor-pointer rounded-lg border disabled:cursor-not-allowed text-center';

const accentClassName =
  'border-accent-400 bg-accent-700 disabled:bg-accent-800 disabled:border-accent-600 hover:border-accent-200 hover:bg-accent-600 cursor-pointer rounded-lg border disabled:cursor-not-allowed text-light-500 text-center';

export const buttonVariants: Record<ButtonVariants, string> = {
  default: defaultClassName,
  accent: accentClassName,
};
