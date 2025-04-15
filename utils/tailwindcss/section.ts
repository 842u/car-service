import { SectionVariants } from '@/types';

const baseClassName = 'border rounded-md p-4 text-sm w-full';

const defaultClassName = `${baseClassName} border-alpha-grey-200 bg-alpha-grey-50`;

const transparentClassName = `${baseClassName} border-alpha-grey-200`;

const errorDefaultClassName = `${baseClassName} border-error-500 bg-alpha-grey-50`;

const errorTransparentClassName = `${baseClassName} border-error-500`;

export const sectionVariants: Record<SectionVariants, string> = {
  default: defaultClassName,
  transparent: transparentClassName,
  errorDefault: errorDefaultClassName,
  errorTransparent: errorTransparentClassName,
};
