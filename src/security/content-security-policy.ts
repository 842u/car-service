import { allowedOrigins } from './allowed-origins';

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
  value: ["'self'", "'strict-dynamic'"],
};

const scriptSrcElemDirective: Directive = {
  name: 'script-src-elem',
  value: [
    "'self'",
    // next-themes - START
    "'sha256-n46vPwSWuMC0W703pBofImv82Z26xo4LXymv0E9caPk='",
    // next-themes - END
  ],
};

const styleSrcDirective: Directive = {
  name: 'style-src',
  value: [
    "'self'",
    // motion - START
    "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",
    // motion - END
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
