export const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=() , accelerometer=(), gyroscope=(), magnetometer=(), payment=()',
  },
];

export const baseContentSecurityPolicy = {
  'default-src': ["'self'"],
  'base-uri': ["'self'"],
  'connect-src': [
    "'self'",
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/`,
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`,
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/`,
  ],
  'script-src': [
    "'self'",
    "'strict-dynamic'",
    `${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''}`,
  ],
  'script-src-elem': [
    "'self'",
    "'sha256-Ec/XLCqW9IkiT3yUDKK5ftmkQGcF3JzHW7lzlrWMZYQ='",
    "'sha256-sLdiz4PQQzticSdaUW5ty68d0bM0ZaiN4Ko1Xxbh4jA='",
    "'sha256-+aUwzZvCg5noHa8zZgqXocOLZhkL6IC9dsa3++C9XJc='",
  ],
  'style-src': [
    "'self'",
    "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",
    "'sha256-VjPIq1cYqXznFbZg7dYdy285nQGu6nQh4zRwpyOevA0='",
    "'sha256-Q0BRfbzjuC2JhFhdJpVT7aFVDDzlEZ/CbsTK7RoZPas='",
    "'sha256-sPjiXln3Zc/F3lTtseqJMn52NO0hTM326TnrNNPO+5M='",
    `${process.env.NODE_ENV === 'development' ? `'nonce-reactQueryDevtools'` : ''}`,
  ],
  'font-src': ["'self'"],
  'img-src': ["'self'", 'data:', 'blob:'],
  'worker-src': ["'self'"],
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"],
};

export function generateCspString(csp) {
  const directives = Object.keys(csp);

  const directivesString = directives.map(
    (directive) => `${directive} ${csp[directive].join(' ')}`,
  );

  const cspString = directivesString.join('; ');

  return cspString;
}

export function generateCspStringWithNonce() {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const contentSecurityPolicy = {
    ...baseContentSecurityPolicy,
    'script-src': [
      ...baseContentSecurityPolicy['script-src'],
      `'nonce-${nonce}'`,
    ],
    'script-src-elem': [
      ...baseContentSecurityPolicy['script-src-elem'],
      `'nonce-${nonce}'`,
    ],
    'style-src': [
      ...baseContentSecurityPolicy['style-src'],
      `'nonce-${nonce}'`,
    ],
  };

  return { cspString: generateCspString(contentSecurityPolicy), nonce };
}
