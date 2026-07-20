import { expect, test as base } from '@playwright/test';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'supabase/types/supabase';

import {
  createTestUserByEmail,
  deleteTestUserByEmail,
  generateTestEmail,
} from './test-user';

// A raw actor holds its own Supabase session (anon key, signed in directly
// against Supabase, not through the app's /api/auth/sign-in route), so it can
// call PostgREST and RPCs the same way any script with a stolen or
// self-issued user JWT would: entirely bypassing the Next.js server.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const TEST_USER_PASSWORD = process.env.SUPABASE_TEST_USER_PASSWORD!;

type RawActor = SupabaseClient<Database>;

async function createRawActor(): Promise<{ email: string; client: RawActor }> {
  const email = generateTestEmail();

  await createTestUserByEmail(email);

  const client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { error } = await client.auth.signInWithPassword({
    email,
    password: TEST_USER_PASSWORD,
  });

  if (error) {
    throw new Error(`Failed to sign in raw actor ${email}: ${error.message}.`);
  }

  return { email, client };
}

const test = base.extend<{ rawActor: RawActor }>({
  rawActor: async ({}, use) => {
    const { email, client } = await createRawActor();
    await use(client);
    await deleteTestUserByEmail(email);
  },
});

// Every case below targets an arbitrary, never-persisted id. Once table
// privileges are revoked, the permission check happens before Postgres looks
// for a matching row, so a real row would prove nothing an arbitrary one
// doesn't; it would only add a car/ownership graph to build and tear down.

test.describe('direct_write_denial - cars - @api', () => {
  test('insert is denied - @api', async ({ rawActor }) => {
    const { status } = await rawActor
      .from('cars')
      .insert({ custom_name: 'denied' });

    expect(status).toBe(403);
  });

  test('update is denied - @api', async ({ rawActor }) => {
    const { status } = await rawActor
      .from('cars')
      .update({ custom_name: 'denied' })
      .eq('id', crypto.randomUUID());

    expect(status).toBe(403);
  });

  test('delete is denied - @api', async ({ rawActor }) => {
    const { status } = await rawActor
      .from('cars')
      .delete()
      .eq('id', crypto.randomUUID());

    expect(status).toBe(403);
  });
});

test.describe('direct_write_denial - cars_ownerships - @api', () => {
  test('insert is denied - @api', async ({ rawActor }) => {
    const { status } = await rawActor.from('cars_ownerships').insert({
      car_id: crypto.randomUUID(),
      owner_id: crypto.randomUUID(),
      is_primary_owner: true,
    });

    expect(status).toBe(403);
  });

  test('update is denied - @api', async ({ rawActor }) => {
    const { status } = await rawActor
      .from('cars_ownerships')
      .update({ is_primary_owner: true })
      .eq('car_id', crypto.randomUUID())
      .eq('owner_id', crypto.randomUUID());

    expect(status).toBe(403);
  });

  test('delete is denied - @api', async ({ rawActor }) => {
    const { status } = await rawActor
      .from('cars_ownerships')
      .delete()
      .eq('car_id', crypto.randomUUID())
      .eq('owner_id', crypto.randomUUID());

    expect(status).toBe(403);
  });
});

test.describe('direct_write_denial - service_logs - @api', () => {
  test('insert is denied - @api', async ({ rawActor }) => {
    const { status } = await rawActor.from('service_logs').insert({
      car_id: crypto.randomUUID(),
      created_by: crypto.randomUUID(),
      category: ['other'],
      service_date: '2026-01-01',
    });

    expect(status).toBe(403);
  });

  test('update is denied - @api', async ({ rawActor }) => {
    const { status } = await rawActor
      .from('service_logs')
      .update({ notes: 'denied' })
      .eq('id', crypto.randomUUID());

    expect(status).toBe(403);
  });

  test('delete is denied - @api', async ({ rawActor }) => {
    const { status } = await rawActor
      .from('service_logs')
      .delete()
      .eq('id', crypto.randomUUID());

    expect(status).toBe(403);
  });
});

test.describe('direct_write_denial - users - @api', () => {
  test('insert is denied - @api', async ({ rawActor }) => {
    const { status } = await rawActor.from('users').insert({
      id: crypto.randomUUID(),
      email: 'direct-write-denial@example.com',
      user_name: 'direct_write_denial',
    });

    expect(status).toBe(403);
  });

  test('update is denied - @api', async ({ rawActor }) => {
    const { status } = await rawActor
      .from('users')
      .update({ user_name: 'denied' })
      .eq('id', crypto.randomUUID());

    expect(status).toBe(403);
  });
});

test.describe('direct_write_denial - rpc - @api', () => {
  test('create_car_with_primary_owner is denied - @api', async ({
    rawActor,
  }) => {
    const { status } = await rawActor.rpc('create_car_with_primary_owner', {
      car: {},
      primary_owner: {},
    });

    expect(status).toBe(403);
  });

  test('promote_primary_car_owner is denied - @api', async ({ rawActor }) => {
    const { status } = await rawActor.rpc('promote_primary_car_owner', {
      new_primary_owner_id: crypto.randomUUID(),
      target_car_id: crypto.randomUUID(),
    });

    expect(status).toBe(403);
  });
});
