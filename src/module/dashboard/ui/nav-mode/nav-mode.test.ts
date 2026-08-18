import {
  applyNavMode,
  DEFAULT_NAV_MODE,
  NAV_MODES,
  parseNavMode,
} from './nav-mode';

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

describe('parseNavMode', () => {
  it.each(NAV_MODES)('should return %s unchanged', (mode) => {
    expect(parseNavMode(mode)).toBe(mode);
  });

  it('should fall back to the default when the cookie is absent', () => {
    expect(parseNavMode(undefined)).toBe(DEFAULT_NAV_MODE);
  });

  it('should fall back to the default for an unrecognised value', () => {
    expect(parseNavMode('sideways')).toBe(DEFAULT_NAV_MODE);
  });

  it('should fall back to the default for an empty value', () => {
    expect(parseNavMode('')).toBe(DEFAULT_NAV_MODE);
  });
});

describe('applyNavMode', () => {
  it('should write the mode to the nav-mode cookie', () => {
    const cookieSpy = jest.spyOn(document, 'cookie', 'set');

    applyNavMode('expanded');

    expect(cookieSpy).toHaveBeenCalledWith(
      `nav-mode=expanded; Path=/; Max-Age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax`,
    );

    cookieSpy.mockRestore();
  });

  it('should set the attribute on the element that carries it', () => {
    document.body.innerHTML = '<div data-nav-mode="auto"><main></main></div>';

    applyNavMode('collapsed');

    expect(document.querySelector('[data-nav-mode]')).toHaveAttribute(
      'data-nav-mode',
      'collapsed',
    );
  });

  it('should still write the cookie when no element carries the attribute', () => {
    const cookieSpy = jest.spyOn(document, 'cookie', 'set');
    document.body.innerHTML = '<main></main>';

    expect(() => applyNavMode('expanded')).not.toThrow();
    expect(cookieSpy).toHaveBeenCalled();

    cookieSpy.mockRestore();
  });
});
