import {
  baseContentSecurityPolicy,
  generateCspStringWithNonce,
} from './content-security-policy';

function parseCsp(cspString: string): Record<string, string[]> {
  return Object.fromEntries(
    cspString.split('; ').map((directive) => {
      const [name, ...values] = directive.split(' ');
      return [name, values];
    }),
  );
}

describe('baseContentSecurityPolicy', () => {
  it('contains all required directives', () => {
    const { cspString } = generateCspStringWithNonce(baseContentSecurityPolicy);
    const directives = parseCsp(cspString);

    expect(directives).toMatchObject({
      'default-src': expect.any(Array),
      'base-uri': expect.any(Array),
      'connect-src': expect.any(Array),
      'script-src': expect.any(Array),
      'script-src-elem': expect.any(Array),
      'style-src': expect.any(Array),
      'font-src': expect.any(Array),
      'img-src': expect.any(Array),
      'worker-src': expect.any(Array),
      'frame-ancestors': expect.any(Array),
      'form-action': expect.any(Array),
    });
  });

  it('sets frame-ancestors to none', () => {
    const { cspString } = generateCspStringWithNonce(baseContentSecurityPolicy);
    const directives = parseCsp(cspString);

    expect(directives['frame-ancestors']).toEqual(["'none'"]);
  });

  it('sets base-uri to self', () => {
    const { cspString } = generateCspStringWithNonce(baseContentSecurityPolicy);
    const directives = parseCsp(cspString);

    expect(directives['base-uri']).toEqual(["'self'"]);
  });

  it('includes strict-dynamic in script-src', () => {
    const { cspString } = generateCspStringWithNonce(baseContentSecurityPolicy);
    const directives = parseCsp(cspString);

    expect(directives['script-src']).toContain("'strict-dynamic'");
  });

  it('does not contain unsafe-inline', () => {
    const { cspString } = generateCspStringWithNonce(baseContentSecurityPolicy);

    expect(cspString).not.toContain("'unsafe-inline'");
  });

  it('does not contain unsafe-eval', () => {
    const { cspString } = generateCspStringWithNonce(baseContentSecurityPolicy);

    expect(cspString).not.toContain("'unsafe-eval'");
  });

  it('has no comma-separated directive values', () => {
    const { cspString } = generateCspStringWithNonce(baseContentSecurityPolicy);
    const directives = parseCsp(cspString);

    Object.entries(directives).forEach(([_name, values]) => {
      values.forEach((value) => {
        expect(value).not.toContain(',');
      });
    });
  });
});

describe('generateCspStringWithNonce', () => {
  it('returns a valid base64 nonce', () => {
    const { nonce } = generateCspStringWithNonce(baseContentSecurityPolicy);
    const decoded = Buffer.from(nonce, 'base64').toString('utf8');

    expect(decoded).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it('adds nonce to script-src, script-src-elem, and style-src', () => {
    const { cspString, nonce } = generateCspStringWithNonce(
      baseContentSecurityPolicy,
    );
    const directives = parseCsp(cspString);
    const nonceValue = `'nonce-${nonce}'`;

    expect(directives['script-src']).toContain(nonceValue);
    expect(directives['script-src-elem']).toContain(nonceValue);
    expect(directives['style-src']).toContain(nonceValue);
  });

  it('generates a unique nonce on each call', () => {
    const { nonce: nonce1 } = generateCspStringWithNonce(
      baseContentSecurityPolicy,
    );
    const { nonce: nonce2 } = generateCspStringWithNonce(
      baseContentSecurityPolicy,
    );

    expect(nonce1).not.toBe(nonce2);
  });

  it('does not mutate the input policy', () => {
    const scriptSrcBefore = [...baseContentSecurityPolicy['script-src']];

    generateCspStringWithNonce(baseContentSecurityPolicy);

    expect(baseContentSecurityPolicy['script-src']).toEqual(scriptSrcBefore);
  });
});
