import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
  Hr,
} from '@react-email/components';
import React from 'react';

interface EmailLayoutProps {
  preview: string;
  children?: React.ReactNode;
}

/**
 * Workaround for type bug:
 * "Property 'children' is missing in type '{}' but required in type 'TailwindProps'."
 */
const TailwindFixed = Tailwind as React.FC<React.PropsWithChildren<object>>;

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <TailwindFixed>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-140 px-4 py-12">
            <Section className="mb-8 text-center">
              <Text className="m-0 text-2xl font-bold text-gray-900">
                YourApp
              </Text>
            </Section>

            <Section className="rounded-2xl border border-gray-100 bg-white px-10 py-10 shadow-sm">
              {children}
            </Section>

            <Section className="mt-8 text-center">
              <Hr className="mb-6 border-gray-200" />
              <Text className="m-0 text-xs text-gray-400">
                © {new Date().getFullYear()} YourApp.
              </Text>
            </Section>
          </Container>
        </Body>
      </TailwindFixed>
    </Html>
  );
}
