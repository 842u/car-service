import { carGraphTest as test, expect, removeCoOwner } from './api-fixtures';
import { createAnonClient, signInRawActor } from './raw-actor';

// testCarGraph is built through the real app API (api-fixtures.ts), so the
// underlying cars_ownerships row genuinely exists; unlike write denial, read
// scoping depends on a real row matching, not just on a permission check
// short-circuiting before Postgres looks for one.

test.describe('direct_read_scoping - users - @api', () => {
  test('an actor can read their own row directly - @api', async ({
    testCarGraph,
  }) => {
    const { primaryOwner } = testCarGraph;
    const rawPrimaryOwner = await signInRawActor(primaryOwner.email);

    const { data } = await rawPrimaryOwner
      .from('users')
      .select('id')
      .eq('id', primaryOwner.id);

    expect(data).toEqual([{ id: primaryOwner.id }]);
  });

  test('a primary owner can read a co-owner of their car - @api', async ({
    testCarGraph,
  }) => {
    const { primaryOwner, coOwner } = testCarGraph;
    const rawPrimaryOwner = await signInRawActor(primaryOwner.email);

    const { data } = await rawPrimaryOwner
      .from('users')
      .select('id')
      .eq('id', coOwner.id);

    expect(data).toEqual([{ id: coOwner.id }]);
  });

  test('a co-owner can read the primary owner of the same car - @api', async ({
    testCarGraph,
  }) => {
    const { primaryOwner, coOwner } = testCarGraph;
    const rawCoOwner = await signInRawActor(coOwner.email);

    const { data } = await rawCoOwner
      .from('users')
      .select('id')
      .eq('id', primaryOwner.id);

    expect(data).toEqual([{ id: primaryOwner.id }]);
  });

  test('a stranger cannot read a row of someone they share no car with - @api', async ({
    testCarGraph,
  }) => {
    const { primaryOwner, stranger } = testCarGraph;
    const rawStranger = await signInRawActor(stranger.email);

    const { data } = await rawStranger
      .from('users')
      .select('id')
      .eq('id', primaryOwner.id);

    expect(data).toEqual([]);
  });

  test('an anonymous request reads nothing - @api', async ({
    testCarGraph,
  }) => {
    const { primaryOwner } = testCarGraph;
    const anonClient = createAnonClient();

    const { data } = await anonClient
      .from('users')
      .select('id')
      .eq('id', primaryOwner.id);

    expect(data).toEqual([]);
  });

  test('a removed co-owner loses read access to their former co-owner - @api', async ({
    testCarGraph,
  }) => {
    const { primaryOwner, coOwner, carId } = testCarGraph;
    const rawCoOwner = await signInRawActor(coOwner.email);

    await removeCoOwner(primaryOwner, carId, coOwner.id);

    const { data } = await rawCoOwner
      .from('users')
      .select('id')
      .eq('id', primaryOwner.id);

    expect(data).toEqual([]);
  });
});
