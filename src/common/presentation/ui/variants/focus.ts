/**
 * For composites where the visible border is drawn by a wrapper rather than by
 * the control that takes focus. The global `:focus-visible` rule in globals.css
 * covers everything else.
 */
export const wrapperFocusClassName =
  'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-500';
