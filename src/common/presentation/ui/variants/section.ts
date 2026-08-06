// `min-w-0` because a section is always a layout participant, never the thing
// that dictates layout width. Without it a section placed in a flex row or
// grid track floors that track at its content's min-content width, which for
// anything holding a table is a whole unbreakable row. Callers that do want a
// floor state one (`min-w-xs`) and it wins over this.
const baseClassName = 'p-4 text-sm w-full min-w-0';

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
