import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import AccountForm from '@/components/ui/AccountForm/AccountForm';
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
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      DASHBOARD PAGE
      <AccountForm session={session} />
    </main>
  );
}
