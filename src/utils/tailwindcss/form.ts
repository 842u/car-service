import type { FormVariants } from '@/types';

const baseClassName = 'p-4 text-sm w-full flex flex-col gap-2';

const defaultClassName = `${baseClassName} border rounded-md border-alpha-grey-200 bg-alpha-grey-50`;

const transparentClassName = `${baseClassName} border rounded-md border-alpha-grey-200`;

const rawClassName = `${baseClassName} p-0`;

export const formVariants: Record<FormVariants, string> = {
  default: defaultClassName,
  transparent: transparentClassName,
  raw: rawClassName,
};
