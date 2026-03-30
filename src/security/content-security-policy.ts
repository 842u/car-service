import { allowedOrigins } from './allowed-origins';

const isDevelopment = process.env.NODE_ENV === 'development';

interface Directive {
  name: string;
  value: string[];
}

interface ContentSecurityPolicy {
  [key: Directive['name']]: Directive['value'];
}

const defaultSrcDirective: Directive = {
  name: 'default-src',
  value: ["'self'"],
};

const baseUriDirective: Directive = {
  name: 'base-uri',
  value: ["'self'"],
};

const connectSrcDirective: Directive = {
  name: 'connect-src',
  value: [
    "'self'",
    `${allowedOrigins.supabase.auth.href}`,
    `${allowedOrigins.supabase.rest.href}`,
    `${allowedOrigins.supabase.storage.href}`,
  ],
};

const scriptSrcDirective: Directive = {
  name: 'script-src',
  value: [
    "'self'",
    "'strict-dynamic'",
    `${isDevelopment ? "'unsafe-eval'" : ''}`,
  ],
};

const scriptSrcElemDirective: Directive = {
  name: 'script-src-elem',
  value: [
    "'self'",
    // next-themes - START
    "'sha256-rbbnijHn7DZ6ps39myQ3cVQF1H+U/PJfHh5ei/Q2kb8='",
    "'sha256-n46vPwSWuMC0W703pBofImv82Z26xo4LXymv0E9caPk='",
    // next-themes - END
    "'sha256-Vz0fwWS/RBGfX0CgDk4ZXv/OwIIEUP030prvqFa/e9s='",
    "'sha256-P+ENKuy1ajGdnkDBoylo2F59ICER0m6CNM4eemaFB+4='",
  ],
};

const styleSrcDirective: Directive = {
  name: 'style-src',
  value: [
    "'self'",
    "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",
    "'sha256-rZot9UVcdtXL99KiVSLfpDfxS3VtOsOY1PXjNX1ntxg='",
    "'sha256-sHwQzC2ZsVrt1faUYCjF/eo8aIoBlQbGjVstzanL9CU='",
    // Next - START
    "'sha256-ldz4/HaaQgxl7ClJjMpubp7p5ZryxWGew0BQJ/1ev0M='",
    "'sha256-Il3SIh3CKR0rFwTIxGnMrGJp/sFTpMthnrHh8gzEP20='",
    "'sha256-h/GKjXBq1QiwvO1y7p0JkvVZk4w7xTPz2rn2eswXu3k='",
    "'sha256-EGxSJ+22silg1bQ9JENEw9K11R7B+X79u4xwD5Qlxik='",
    "'sha256-tzBMNZ7l8nZ/8oEITbEGeJAgNHg7KpJOduvhc+LO138='",
    "'sha256-YRU82gRq3tqvclIjICrc9UXxYBl+iOGd7Vv7bhPhyTQ='",
    "'sha256-mie6WmUG3QwG7eOyDWBx8Bce20N/LdzUH4Zq20+Xuac='",
    "'sha256-CHox7CF+XF5itK7YJMt8fpMltQv4/krVGqYhlFzvJys='",
    "'sha256-+OZewf8eCqvkslh1/Xykl0aVXjayV2Iy+vePINuzTcE='",
    "'sha256-F6SKLtWtm7VErmrq0jDQtzJvpz6+LcrSfbyczc2xd6o='",
    "'sha256-1Rgj9Tmw9SU4h9nklK6l294O2abdhNs1l+3ZoCwzxUA='",
    "'sha256-UAihfItDa9VybE65LGSN8u3Hsk+Obut4I2HMuUxGIAU='",
    "'sha256-OpIODBPkpoiPLrmWVWQAuUTdbHmO2qBKzuQ9qR3th9M='",
    "'sha256-4GzqRlwcGp7cD3kANBs5f/CO/iqLwfJq0WYAq59xN6E='",
    "'sha256-oWSHr/vRLelbPs4/D0cMyJPQiBZ++BztsCUSohl+qfA='",
    "'sha256-9zL9D7V4ZS7/Ejl2hJBaUhvb6Kz0qP63cZJdse7FKNQ='",
    "'sha256-1RxEtrnAd5b7dSm+dsmII7JA/VKWYqnnpz1uflgEuHM='",
    "'sha256-CUsJx2gBDO+oKhgx2vFJvbgkZLqueGGG5FC5IxI938I='",
    "'sha256-Wwucq8eX2r0YFymkQhDXm5hN0+FfSvI3s4JSSaqa4iw='",
    // Next - END
    `${isDevelopment ? `'nonce-reactQueryDevtools'` : ''}`,
  ],
};

const fontSrcDirective: Directive = {
  name: 'font-src',
  value: ["'self'"],
};

const imgSrcDirective: Directive = {
  name: 'img-src',
  value: ["'self'", 'data:', 'blob:'],
};

const workerSrcDirective: Directive = {
  name: 'worker-src',
  value: ["'self'"],
};

const frameAncestorsDirective: Directive = {
  name: 'frame-ancestors',
  value: ["'none'"],
};

const formActionDirective: Directive = {
  name: 'form-action',
  value: ["'self'"],
} as const;

function generateCspString(contentSecurityPolicy: ContentSecurityPolicy) {
  const directivesNames = Object.keys(contentSecurityPolicy);
  const directivesString = directivesNames.map(
    (directiveName) =>
      `${directiveName} ${contentSecurityPolicy[directiveName].join(' ')}`,
  );
  const cspString = directivesString.join('; ');

  return cspString;
}

export const baseContentSecurityPolicy: ContentSecurityPolicy = {
  [defaultSrcDirective.name]: defaultSrcDirective.value,
  [baseUriDirective.name]: baseUriDirective.value,
  [connectSrcDirective.name]: connectSrcDirective.value,
  [scriptSrcDirective.name]: scriptSrcDirective.value,
  [scriptSrcElemDirective.name]: scriptSrcElemDirective.value,
  [styleSrcDirective.name]: styleSrcDirective.value,
  [fontSrcDirective.name]: fontSrcDirective.value,
  [imgSrcDirective.name]: imgSrcDirective.value,
  [workerSrcDirective.name]: workerSrcDirective.value,
  [frameAncestorsDirective.name]: frameAncestorsDirective.value,
  [formActionDirective.name]: formActionDirective.value,
};

export function generateCspStringWithNonce(csp: ContentSecurityPolicy) {
  const nonceHash = Buffer.from(crypto.randomUUID()).toString('base64');
  const nonceString = `'nonce-${nonceHash}'`;

  const cspWithNonce = {
    ...csp,
    [scriptSrcDirective.name]: [...scriptSrcDirective.value],
    [scriptSrcElemDirective.name]: [...scriptSrcElemDirective.value],
    [styleSrcDirective.name]: [...styleSrcDirective.value],
  };

  cspWithNonce[scriptSrcDirective.name].push(nonceString);
  cspWithNonce[scriptSrcElemDirective.name].push(nonceString);
  cspWithNonce[styleSrcDirective.name].push(nonceString);

  return {
    cspString: generateCspString(cspWithNonce),
    nonce: nonceHash,
  };
}
