import type { ButtonVariants } from './button';
import { buttonVariants } from './button';

/**
 * An `<a>` is never `:disabled`, so `buttonVariants`' disabled:* classes are
 * dead weight on LinkButton. Derived here (rather than hand-duplicated) so
 * button.ts stays the single source of truth for each variant's colors.
 */
export const linkButtonVariants: Record<ButtonVariants, string> =
  Object.fromEntries(
    Object.entries(buttonVariants).map(([variant, classes]) => [
      variant,
      classes
        .split(' ')
        .filter((className) => !className.startsWith('disabled:'))
        .join(' '),
    ]),
  ) as Record<ButtonVariants, string>;
