import { expect, test as base } from '@playwright/test';

import { createRawActor, type RawActor } from './raw-actor';
import { deleteTestUserByEmail } from './test-user';

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
