import { Resend } from 'resend';
import { Webhook } from 'standardwebhooks';
import { render } from '@react-email/render';
import React from 'react';
import EmailConfirmEmail from './emails/EmailConfirmEmail.tsx';
import PasswordResetEmail from './emails/PasswordResetEmail.tsx';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SENDER_EMAIL = Deno.env.get('SENDER_EMAIL');
const SEND_AUTH_EMAIL_HOOK_SECRET = Deno.env.get('SEND_AUTH_EMAIL_HOOK_SECRET');

interface WebhookPayload {
  user: {
    id: string;
    email: string;
    user_metadata?: Record<string, unknown>;
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: 'signup' | 'recovery';
    site_url: string;
    token_new?: string;
    token_hash_new?: string;
  };
}

interface EmailConfig {
  subject: string;
  html: string;
}

async function getEmailConfig(payload: WebhookPayload): Promise<EmailConfig> {
  const {
    user: { email },
    email_data: { email_action_type, redirect_to, token_hash },
  } = payload;

  switch (email_action_type) {
    case 'signup': {
      const confirmUrl = `${redirect_to}?token_hash=${token_hash}&type=email&next=/dashboard`;
      return {
        subject: 'Confirm your email address',
        html: await render(
          React.createElement(EmailConfirmEmail, {
            email,
            confirmUrl,
          }),
        ),
      };
    }

    case 'recovery': {
      const resetUrl = `${redirect_to}?token_hash=${token_hash}&type=recovery&next=/dashboard/account`;
      return {
        subject: 'Reset your password',
        html: await render(
          React.createElement(PasswordResetEmail, {
            email,
            resetUrl,
          }),
        ),
      };
    }

    default:
      throw new Error(`Unhandled auth hook type: ${email_action_type}`);
  }
}

const resend = new Resend(RESEND_API_KEY);

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (!RESEND_API_KEY || !SEND_AUTH_EMAIL_HOOK_SECRET || !SENDER_EMAIL) {
    console.error('Missing required environment variables.');
    return new Response('Internal Server Error: Configuration missing', {
      status: 500,
    });
  }

  const webhook = new Webhook(
    SEND_AUTH_EMAIL_HOOK_SECRET.replace('v1,whsec_', ''),
  );
  const headers = Object.fromEntries(req.headers);
  const reqPayload = await req.text();

  try {
    const webhookPayload = webhook.verify(
      reqPayload,
      headers,
    ) as unknown as WebhookPayload;

    const { subject, html } = await getEmailConfig(webhookPayload);

    const { error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [webhookPayload.user.email],
      subject,
      html,
    });

    if (error) {
      throw error;
    }

    console.log(
      `Email sent successfully for ${webhookPayload.email_data.email_action_type} to ${webhookPayload.user.email}`,
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
});
