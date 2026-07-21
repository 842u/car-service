import { expect } from '@playwright/test';

import { unauthenticatedTest as test } from './api-fixtures';

// Every case below targets an arbitrary, never-persisted id. Authentication
// is the first check inside every use case, ahead of Visibility and any
// repository read, so a real car/ownership/service-log graph would prove
// nothing an arbitrary id doesn't; it would only add a graph to build and
// tear down.

test.describe('unauthenticated_write_denial - car - @api', () => {
  test('edit is denied - @api', async ({ unauthenticatedRequest }) => {
    const response = await unauthenticatedRequest.patch('/api/car', {
      data: { carId: crypto.randomUUID(), customName: 'denied' },
    });

    expect(response.status()).toBe(401);
  });

  test('image change is denied - @api', async ({ unauthenticatedRequest }) => {
    const response = await unauthenticatedRequest.patch('/api/car/image', {
      data: {
        carId: crypto.randomUUID(),
        imageUrl: 'https://example.com/denied.png',
      },
    });

    expect(response.status()).toBe(401);
  });

  test('remove is denied - @api', async ({ unauthenticatedRequest }) => {
    const response = await unauthenticatedRequest.delete('/api/car', {
      data: { carId: crypto.randomUUID() },
    });

    expect(response.status()).toBe(401);
  });
});

test.describe('unauthenticated_write_denial - ownership - @api', () => {
  test('add is denied - @api', async ({ unauthenticatedRequest }) => {
    const response = await unauthenticatedRequest.post('/api/car/ownership', {
      data: { carId: crypto.randomUUID(), ownerId: crypto.randomUUID() },
    });

    expect(response.status()).toBe(401);
  });

  test('promote is denied - @api', async ({ unauthenticatedRequest }) => {
    const response = await unauthenticatedRequest.patch('/api/car/ownership', {
      data: { carId: crypto.randomUUID(), ownerId: crypto.randomUUID() },
    });

    expect(response.status()).toBe(401);
  });

  test('remove is denied - @api', async ({ unauthenticatedRequest }) => {
    const response = await unauthenticatedRequest.delete('/api/car/ownership', {
      data: { carId: crypto.randomUUID(), ownerId: crypto.randomUUID() },
    });

    expect(response.status()).toBe(401);
  });
});

test.describe('unauthenticated_write_denial - service-log - @api', () => {
  test('add is denied - @api', async ({ unauthenticatedRequest }) => {
    const response = await unauthenticatedRequest.post('/api/car/service-log', {
      data: {
        carId: crypto.randomUUID(),
        serviceDate: '2026-01-01',
        categories: ['other'],
      },
    });

    expect(response.status()).toBe(401);
  });

  test('edit is denied - @api', async ({ unauthenticatedRequest }) => {
    const response = await unauthenticatedRequest.patch(
      '/api/car/service-log',
      {
        data: {
          serviceLogId: crypto.randomUUID(),
          serviceDate: '2026-01-01',
          categories: ['other'],
        },
      },
    );

    expect(response.status()).toBe(401);
  });

  test('remove is denied - @api', async ({ unauthenticatedRequest }) => {
    const response = await unauthenticatedRequest.delete(
      '/api/car/service-log',
      {
        data: { serviceLogId: crypto.randomUUID() },
      },
    );

    expect(response.status()).toBe(401);
  });
});
