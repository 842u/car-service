/**
 * For composites where the visible border is drawn by a wrapper rather than by
 * the control that takes focus. The global `:focus-visible` rule in globals.css
 * covers everything else.
 *
 * `wrapper-focus-outline` is not a Tailwind utility; it's a bare selector hook
 * so the instant-outline rule in globals.css can target this wrapper pattern
 * specifically, instead of every ancestor of a focused element.
 */
export const wrapperFocusClassName =
  'wrapper-focus-outline has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-500';
