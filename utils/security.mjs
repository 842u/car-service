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
    "'sha256-rbbnijHn7DZ6ps39myQ3cVQF1H+U/PJfHh5ei/Q2kb8='",
    "'sha256-Vz0fwWS/RBGfX0CgDk4ZXv/OwIIEUP030prvqFa/e9s='",
    "'sha256-P+ENKuy1ajGdnkDBoylo2F59ICER0m6CNM4eemaFB+4='",
  ],
  'style-src': [
    "'self'",
    "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",
    "'sha256-fNQvmabDUct/Q8bVROR2oAMzjWD2CYHGuJj7V7Sxgfc='",
    "'sha256-m8dEh7VmKFRCO8jEWPbmkeO1mq4SIx8omtyx50rrS/M='",
    "'sha256-N7LtYMn8V4wJc3qizzc77tEs0O1HIy5OTDGzhMvguUs='",
    "'sha256-rZot9UVcdtXL99KiVSLfpDfxS3VtOsOY1PXjNX1ntxg='",
    "'sha256-sShq9hrV/jIzaV2Q3pM8oaP2GaOPh4po5NUVewSCGdo='",
    "'sha256-Ylx4sWaDgn6RRamxe7jevX4yDhNtiSG3CQWrPAdPh6A='",
    "'sha256-sHwQzC2ZsVrt1faUYCjF/eo8aIoBlQbGjVstzanL9CU='",
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
