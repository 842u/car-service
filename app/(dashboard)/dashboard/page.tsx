import { createClient } from '@/utils/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h1>DASHBOARD</h1>
      <p>{user?.email}</p>
    </main>
  );
}
