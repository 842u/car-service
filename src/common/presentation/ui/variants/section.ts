const baseClassName = 'p-4 text-sm w-full';

const defaultClassName = `${baseClassName} border rounded-md border-alpha-grey-200 bg-alpha-grey-50`;

const transparentClassName = `${baseClassName} border rounded-md border-alpha-grey-200`;

const errorDefaultClassName = `${baseClassName} border rounded-md border-error-500 bg-alpha-grey-50`;

const errorTransparentClassName = `${baseClassName} border rounded-md border-error-500`;

export type SectionVariants =
  | 'raw'
  | 'default'
  | 'transparent'
  | 'errorDefault'
  | 'errorTransparent';

export const sectionVariants: Record<SectionVariants, string> = {
  raw: baseClassName,
  default: defaultClassName,
  transparent: transparentClassName,
  errorDefault: errorDefaultClassName,
  errorTransparent: errorTransparentClassName,
};
