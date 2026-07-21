import { carGraphTest as test, expect } from './api-fixtures';

test.describe('car_write_flow - edit - @api', () => {
  test('primary owner can edit the car - @api', async ({ testCarGraph }) => {
    const { primaryOwner, carId } = testCarGraph;

    const response = await primaryOwner.request.patch('/api/car', {
      data: { carId, customName: 'Edited by primary owner' },
    });

    expect(response.status()).toBe(200);
  });

  test('co-owner editing the car is forbidden - @api', async ({
    testCarGraph,
  }) => {
    const { coOwner, carId } = testCarGraph;

    const response = await coOwner.request.patch('/api/car', {
      data: { carId, customName: 'Edited by co-owner' },
    });

    expect(response.status()).toBe(403);
  });

  test('stranger editing the car gets not-found - @api', async ({
    testCarGraph,
  }) => {
    const { stranger, carId } = testCarGraph;

    const response = await stranger.request.patch('/api/car', {
      data: { carId, customName: 'Edited by stranger' },
    });

    expect(response.status()).toBe(404);
  });
});

test.describe('car_write_flow - remove - @api', () => {
  test('primary owner can remove the car - @api', async ({ testCarGraph }) => {
    const { primaryOwner, carId } = testCarGraph;

    const response = await primaryOwner.request.delete('/api/car', {
      data: { carId },
    });

    expect(response.status()).toBe(200);
  });

  test('co-owner removing the car is forbidden - @api', async ({
    testCarGraph,
  }) => {
    const { coOwner, carId } = testCarGraph;

    const response = await coOwner.request.delete('/api/car', {
      data: { carId },
    });

    expect(response.status()).toBe(403);
  });

  test('stranger removing the car gets not-found - @api', async ({
    testCarGraph,
  }) => {
    const { stranger, carId } = testCarGraph;

    const response = await stranger.request.delete('/api/car', {
      data: { carId },
    });

    expect(response.status()).toBe(404);
  });
});
