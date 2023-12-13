import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import AccountForm from '@/components/ui/AccountForm/AccountForm';
import { Database } from '@/types/supabase';

export default async function AccountPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <AccountForm session={session} />
    </main>
  );
}
