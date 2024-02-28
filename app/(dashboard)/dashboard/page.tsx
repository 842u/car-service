import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';

import { Database } from '@/types/supabase';

export default async function DashboardPage() {
  const cookieStore = cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h1>DASHBOARD</h1>
      <p>{user?.email}</p>
      <Link href="/dashboard/account/password-reset">Reset password</Link>
    </main>
  );
}
