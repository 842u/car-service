/**
 * How the dashboard nav behaves on wide viewports. Listed in the order the
 * control offers them: the default first, then by resting width.
 */
export const NAV_MODES = ['auto', 'collapsed', 'expanded'] as const;

export type NavMode = (typeof NAV_MODES)[number];

export const DEFAULT_NAV_MODE: NavMode = 'auto';

const NAV_MODE_COOKIE_MAX_AGE_IN_SECONDS = 60 * 60 * 24 * 365;

export const NAV_MODE_COOKIE_NAME = 'nav-mode';

/**
 * Narrows an untrusted cookie value to a mode.
 *
 * The cookie is client-writable and outlives any one build, so a value left by
 * an older one or by a hand-edited cookie jar has to resolve to something. It
 * resolves to the mode the dashboard had before the preference existed.
 */
export function parseNavMode(value: string | undefined): NavMode {
  return NAV_MODES.find((mode) => mode === value) ?? DEFAULT_NAV_MODE;
}

/**
 * Persists a nav mode and applies it to the page it was chosen on.
 *
 * The cookie is what the next request reads, so the first frame the server
 * sends already carries the right mode and the dashboard never shifts sideways
 * once JavaScript arrives. The attribute is what the current page responds to,
 * since all three modes are CSS keyed off it.
 *
 * The attribute's element is looked up rather than handed in. It sits on the
 * dashboard shell, above both the nav and the main region, while the control
 * that calls this renders inside a panel portaled to `body`, so nothing in the
 * control's own subtree can reach it.
 */
export function applyNavMode(mode: NavMode): void {
  document.cookie = `${NAV_MODE_COOKIE_NAME}=${mode}; Path=/; Max-Age=${NAV_MODE_COOKIE_MAX_AGE_IN_SECONDS}; SameSite=Lax`;

  document
    .querySelector('[data-nav-mode]')
    ?.setAttribute('data-nav-mode', mode);
}
