import { Button, Heading, Text } from '@react-email/components';

import { EmailLayout } from './_layout';

interface EmailConfirmEmailProps {
  email: string;
  confirmUrl: string;
}

export function EmailConfirmEmail({
  email = 'user@example.com',
  confirmUrl = 'https://some-url.com/',
}: EmailConfirmEmailProps) {
  return (
    <EmailLayout preview="Confirm your email address to get started">
      <Heading className="mt-0 mb-2 text-2xl font-bold text-gray-900">
        Confirm your email
      </Heading>
      <Text className="mt-0 mb-1 text-gray-500">
        Thanks for signing up! Please confirm your email address to activate
        your account.
      </Text>
      <Text className="mt-0 mb-6 text-sm text-gray-400">{email}</Text>

      <Button
        className="block rounded-lg bg-black px-6 py-3 text-center text-sm font-semibold text-white no-underline"
        href={confirmUrl}
      >
        Confirm email address
      </Button>

      <Text className="mt-2 mb-0 text-xs break-all text-gray-400">
        Or copy this URL: {confirmUrl}
      </Text>

      <Text className="mt-6 mb-0 text-xs text-gray-400">
        If you didn&apos;t create an account, you can safely ignore this email.
      </Text>
    </EmailLayout>
  );
}

export default EmailConfirmEmail;
