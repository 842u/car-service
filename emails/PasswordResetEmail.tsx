import { Button, Heading, Text } from '@react-email/components';

import { EmailLayout } from './_layout';

interface PasswordResetEmailProps {
  email: string;
  resetUrl: string;
}

export function PasswordResetEmail({
  email = 'user@example.com',
  resetUrl = 'https://some-url.com/',
}: PasswordResetEmailProps) {
  return (
    <EmailLayout preview="Reset your YourApp password">
      <Heading className="mt-0 mb-2 text-2xl font-bold text-gray-900">
        Reset your password
      </Heading>
      <Text className="mt-0 mb-1 text-gray-500">
        We received a request to reset the password for your account. Click the
        button below to sign in and choose a new password.
      </Text>
      <Text className="mt-0 mb-6 text-sm text-gray-400">{email}</Text>

      <Button
        className="block rounded-lg bg-black px-6 py-3 text-center text-sm font-semibold text-white no-underline"
        href={resetUrl}
      >
        Reset password
      </Button>

      <Text className="mt-2 mb-0 text-xs break-all text-gray-400">
        Or copy this URL: {resetUrl}
      </Text>

      <Text className="mt-6 mb-0 text-xs text-gray-400">
        If you didn&apos;t request a password reset, you can safely ignore this
        email.
      </Text>
    </EmailLayout>
  );
}

export default PasswordResetEmail;
