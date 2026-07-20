import { expect, serviceLogGraphTest as test } from './api-fixtures';

test.describe('service_log_write_flow - add - @api', () => {
  test('primary owner can add a service log - @api', async ({
    testServiceLogGraph,
  }) => {
    const { primaryOwner, carId } = testServiceLogGraph;

    const response = await primaryOwner.request.post('/api/car/service-log', {
      data: { carId, serviceDate: '2026-02-01', categories: ['other'] },
    });

    expect(response.status()).toBe(201);
  });

  test('co-owner can add a service log - @api', async ({
    testServiceLogGraph,
  }) => {
    const { nonAuthorCoOwner, carId } = testServiceLogGraph;

    const response = await nonAuthorCoOwner.request.post(
      '/api/car/service-log',
      {
        data: { carId, serviceDate: '2026-02-01', categories: ['other'] },
      },
    );

    expect(response.status()).toBe(201);
  });

  test('stranger adding a service log gets not-found - @api', async ({
    testServiceLogGraph,
  }) => {
    const { stranger, carId } = testServiceLogGraph;

    const response = await stranger.request.post('/api/car/service-log', {
      data: { carId, serviceDate: '2026-02-01', categories: ['other'] },
    });

    expect(response.status()).toBe(404);
  });
});

test.describe('service_log_write_flow - edit - @api', () => {
  test('primary owner can edit any service log - @api', async ({
    testServiceLogGraph,
  }) => {
    const { primaryOwner, serviceLogId } = testServiceLogGraph;

    const response = await primaryOwner.request.patch('/api/car/service-log', {
      data: {
        serviceLogId,
        serviceDate: '2026-03-01',
        categories: ['other'],
      },
    });

    expect(response.status()).toBe(200);
  });

  test('author can edit their own service log - @api', async ({
    testServiceLogGraph,
  }) => {
    const { authorCoOwner, serviceLogId } = testServiceLogGraph;

    const response = await authorCoOwner.request.patch('/api/car/service-log', {
      data: {
        serviceLogId,
        serviceDate: '2026-03-01',
        categories: ['other'],
      },
    });

    expect(response.status()).toBe(200);
  });

  test('non-author co-owner editing a service log is forbidden - @api', async ({
    testServiceLogGraph,
  }) => {
    const { nonAuthorCoOwner, serviceLogId } = testServiceLogGraph;

    const response = await nonAuthorCoOwner.request.patch(
      '/api/car/service-log',
      {
        data: {
          serviceLogId,
          serviceDate: '2026-03-01',
          categories: ['other'],
        },
      },
    );

    expect(response.status()).toBe(403);
  });

  test('stranger editing a service log gets not-found - @api', async ({
    testServiceLogGraph,
  }) => {
    const { stranger, serviceLogId } = testServiceLogGraph;

    const response = await stranger.request.patch('/api/car/service-log', {
      data: {
        serviceLogId,
        serviceDate: '2026-03-01',
        categories: ['other'],
      },
    });

    expect(response.status()).toBe(404);
  });
});

test.describe('service_log_write_flow - remove - @api', () => {
  test('primary owner can remove any service log - @api', async ({
    testServiceLogGraph,
  }) => {
    const { primaryOwner, serviceLogId } = testServiceLogGraph;

    const response = await primaryOwner.request.delete('/api/car/service-log', {
      data: { serviceLogId },
    });

    expect(response.status()).toBe(200);
  });

  test('author can remove their own service log - @api', async ({
    testServiceLogGraph,
  }) => {
    const { authorCoOwner, serviceLogId } = testServiceLogGraph;

    const response = await authorCoOwner.request.delete(
      '/api/car/service-log',
      {
        data: { serviceLogId },
      },
    );

    expect(response.status()).toBe(200);
  });

  test('non-author co-owner removing a service log is forbidden - @api', async ({
    testServiceLogGraph,
  }) => {
    const { nonAuthorCoOwner, serviceLogId } = testServiceLogGraph;

    const response = await nonAuthorCoOwner.request.delete(
      '/api/car/service-log',
      {
        data: { serviceLogId },
      },
    );

    expect(response.status()).toBe(403);
  });

  test('stranger removing a service log gets not-found - @api', async ({
    testServiceLogGraph,
  }) => {
    const { stranger, serviceLogId } = testServiceLogGraph;

    const response = await stranger.request.delete('/api/car/service-log', {
      data: { serviceLogId },
    });

    expect(response.status()).toBe(404);
  });
});
