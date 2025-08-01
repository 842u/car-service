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
  value: [
    "'self'",
    "'strict-dynamic'",
    `${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''}`,
  ],
};

const scriptSrcElemDirective: Directive = {
  name: 'script-src-elem',
  value: [
    "'self'",
    "'sha256-rbbnijHn7DZ6ps39myQ3cVQF1H+U/PJfHh5ei/Q2kb8='",
    "'sha256-Vz0fwWS/RBGfX0CgDk4ZXv/OwIIEUP030prvqFa/e9s='",
    "'sha256-P+ENKuy1ajGdnkDBoylo2F59ICER0m6CNM4eemaFB+4='",
    "'sha256-n46vPwSWuMC0W703pBofImv82Z26xo4LXymv0E9caPk='",
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
    "'sha256-QknUhlq+bA4bg8QkOdghRZHreE5JGI3Z6r8emWTbClA='",
    "'sha256-QCFKgBRT4/1dE2iOOdPA0dvDEE8ha6ghvogOX1ONFHE='",
    "'sha256-Rhy8yaQLCXMiE7oSWWhNMMJtIsNap07+1/qnwtairBk='",
    "'sha256-Ylx4sWaDgn6RRamxe7jevX4yDhNtiSG3CQWrPAdPh6A='",
    "'sha256-m8dEh7VmKFRCO8jEWPbmkeO1mq4SIx8omtyx50rrS/M='",
    "'sha256-vcAPIwtkyGYAib9fqB9x2914jj8vt7smJqLhKeLMPYE='",
    "'sha256-csbTq2KBAUJKn3FYGRkmk76PbhLi6RmywozDmGN+6HE='",
    "'sha256-I9GKdPiOauosrTFpRTOGBFg/1fmBPbBmnqDD5jhUeKc='",
    // Next - END
    `${process.env.NODE_ENV === 'development' ? `'nonce-reactQueryDevtools'` : ''}`,
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
