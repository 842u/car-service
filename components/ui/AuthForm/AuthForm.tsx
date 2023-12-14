'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createBrowserClient } from '@supabase/ssr';

import { Database } from '@/types/supabase';

export default function AuthForm() {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  return (
    <Auth
      appearance={{ theme: ThemeSupa }}
      providers={[]}
      redirectTo="http://localhost:3000/api/auth/callback"
      showLinks={false}
      supabaseClient={supabase}
      theme="dark"
      view="magic_link"
    />
  );
}
