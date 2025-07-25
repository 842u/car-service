interface Header {
  key: string;
  value: string;
}

const xFrameOptionsHeader: Header = {
  key: 'X-Frame-Options',
  value: 'DENY',
};

const xXssProtectionHeader: Header = {
  key: 'X-XSS-Protection',
  value: '1; mode=block',
};

const xContentTypeOptionsHeader: Header = {
  key: 'X-Content-Type-Options',
  value: 'nosniff',
};

const xDnsPrefetchControlHeader: Header = {
  key: 'X-DNS-Prefetch-Control',
  value: 'on',
};

const referrerPolicyHeader: Header = {
  key: 'Referrer-Policy',
  value: 'strict-origin-when-cross-origin',
};

const strictTransportSecurityHeader: Header = {
  key: 'Strict-Transport-Security',
  value: 'max-age=31536000; includeSubDomains',
};

const permissionsPolicyHeader: Header = {
  key: 'Permissions-Policy',
  value:
    'camera=(), microphone=(), geolocation=() , accelerometer=(), gyroscope=(), magnetometer=(), payment=()',
};

export const securityHeaders = [
  xFrameOptionsHeader,
  xXssProtectionHeader,
  xContentTypeOptionsHeader,
  xDnsPrefetchControlHeader,
  referrerPolicyHeader,
  strictTransportSecurityHeader,
  permissionsPolicyHeader,
];
