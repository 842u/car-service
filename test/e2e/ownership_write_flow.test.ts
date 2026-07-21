import {
  addCoOwner,
  carGraphTest as test,
  createApiActor,
  disposeApiActor,
  expect,
} from './api-fixtures';

test.describe('ownership_write_flow - add - @api', () => {
  test('primary owner can add a co-owner - @api', async ({ testCarGraph }) => {
    const { primaryOwner, carId } = testCarGraph;
    const newCoOwner = await createApiActor();

    try {
      const response = await primaryOwner.request.post('/api/car/ownership', {
        data: { carId, ownerId: newCoOwner.id },
      });

      expect(response.status()).toBe(201);
    } finally {
      await disposeApiActor(newCoOwner);
    }
  });

  test('co-owner adding a co-owner is forbidden - @api', async ({
    testCarGraph,
  }) => {
    const { coOwner, carId } = testCarGraph;
    const newCoOwner = await createApiActor();

    try {
      const response = await coOwner.request.post('/api/car/ownership', {
        data: { carId, ownerId: newCoOwner.id },
      });

      expect(response.status()).toBe(403);
    } finally {
      await disposeApiActor(newCoOwner);
    }
  });

  test('stranger adding a co-owner gets not-found - @api', async ({
    testCarGraph,
  }) => {
    const { stranger, carId } = testCarGraph;
    const newCoOwner = await createApiActor();

    try {
      const response = await stranger.request.post('/api/car/ownership', {
        data: { carId, ownerId: newCoOwner.id },
      });

      expect(response.status()).toBe(404);
    } finally {
      await disposeApiActor(newCoOwner);
    }
  });
});

test.describe('ownership_write_flow - promote - @api', () => {
  test('primary owner can promote a co-owner - @api', async ({
    testCarGraph,
  }) => {
    const { primaryOwner, coOwner, carId } = testCarGraph;

    const response = await primaryOwner.request.patch('/api/car/ownership', {
      data: { carId, ownerId: coOwner.id },
    });

    expect(response.status()).toBe(200);
  });

  test('co-owner promoting themselves is forbidden - @api', async ({
    testCarGraph,
  }) => {
    const { coOwner, carId } = testCarGraph;

    const response = await coOwner.request.patch('/api/car/ownership', {
      data: { carId, ownerId: coOwner.id },
    });

    expect(response.status()).toBe(403);
  });

  test('stranger promoting a co-owner gets not-found - @api', async ({
    testCarGraph,
  }) => {
    const { stranger, coOwner, carId } = testCarGraph;

    const response = await stranger.request.patch('/api/car/ownership', {
      data: { carId, ownerId: coOwner.id },
    });

    expect(response.status()).toBe(404);
  });
});

test.describe('ownership_write_flow - remove - @api', () => {
  test('primary owner can remove a co-owner - @api', async ({
    testCarGraph,
  }) => {
    const { primaryOwner, coOwner, carId } = testCarGraph;

    const response = await primaryOwner.request.delete('/api/car/ownership', {
      data: { carId, ownerId: coOwner.id },
    });

    expect(response.status()).toBe(200);
  });

  test('co-owner can remove themselves - @api', async ({ testCarGraph }) => {
    const { coOwner, carId } = testCarGraph;

    const response = await coOwner.request.delete('/api/car/ownership', {
      data: { carId, ownerId: coOwner.id },
    });

    expect(response.status()).toBe(200);
  });

  test('co-owner removing a different co-owner is forbidden - @api', async ({
    testCarGraph,
  }) => {
    const { primaryOwner, coOwner, carId } = testCarGraph;
    const otherCoOwner = await createApiActor();

    try {
      await addCoOwner(primaryOwner, carId, otherCoOwner.id);

      const response = await coOwner.request.delete('/api/car/ownership', {
        data: { carId, ownerId: otherCoOwner.id },
      });

      expect(response.status()).toBe(403);
    } finally {
      await disposeApiActor(otherCoOwner);
    }
  });

  test('stranger removing a co-owner gets not-found - @api', async ({
    testCarGraph,
  }) => {
    const { stranger, coOwner, carId } = testCarGraph;

    const response = await stranger.request.delete('/api/car/ownership', {
      data: { carId, ownerId: coOwner.id },
    });

    expect(response.status()).toBe(404);
  });
});
