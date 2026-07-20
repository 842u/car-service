import type { APIRequestContext, APIResponse } from '@playwright/test';
import { request as playwrightRequest, test as base } from '@playwright/test';

import { adminDatabaseClient } from '@/dependency/database-client/admin';

import {
  createTestUserByEmail,
  deleteTestUserByEmail,
  generateTestEmail,
} from './test-user';

// Node's fetch (undici) resolves 'localhost' to '::1' first; if the webServer
// only listens on IPv4, that first hop hangs until connect-timeout. The
// browser-driven specs don't hit this (Chromium's own resolver differs), but
// every request here goes through Node, so it must target the IPv4 loopback
// directly.
const BASE_URL = 'http://127.0.0.1:3000';
const TEST_USER_PASSWORD = process.env.SUPABASE_TEST_USER_PASSWORD!;

export type ApiActor = {
  id: string;
  email: string;
  request: APIRequestContext;
};

async function extractId(response: APIResponse): Promise<string> {
  const body = (await response.json()) as { data: { id: string } };
  return body.data.id;
}

async function createApiActor(): Promise<ApiActor> {
  const email = generateTestEmail();

  await createTestUserByEmail(email);

  const request = await playwrightRequest.newContext({ baseURL: BASE_URL });

  const signInResponse = await request.post('/api/auth/sign-in', {
    data: { email, password: TEST_USER_PASSWORD },
  });

  if (!signInResponse.ok()) {
    throw new Error(
      `Failed to sign in test actor ${email}: ${signInResponse.status()}.`,
    );
  }

  const id = await extractId(signInResponse);

  return { id, email, request };
}

async function disposeApiActor(actor: ApiActor): Promise<void> {
  await actor.request.dispose();
  await deleteTestUserByEmail(actor.email);
}

/**
 * Creates `count` actors and, if any of them fails, disposes whichever
 * already succeeded before rethrowing, so a partial failure never leaks
 * test users into the database.
 */
async function createApiActors(count: number): Promise<ApiActor[]> {
  const results = await Promise.allSettled(
    Array.from({ length: count }, () => createApiActor()),
  );

  const created = results
    .filter(
      (result): result is PromiseFulfilledResult<ApiActor> =>
        result.status === 'fulfilled',
    )
    .map((result) => result.value);

  const failures = results.filter(
    (result): result is PromiseRejectedResult => result.status === 'rejected',
  );

  if (failures.length > 0) {
    await Promise.all(created.map(disposeApiActor));

    throw new Error(
      `Failed to create ${failures.length} of ${count} test actors: ${failures
        .map((failure) => String(failure.reason))
        .join('; ')}.`,
    );
  }

  return created;
}

async function deleteTestCar(carId: string): Promise<void> {
  const result = await adminDatabaseClient.query<{ id: string }>(
    async (query) => query('cars').delete().eq('id', carId).select('id'),
  );

  if (!result.success) {
    const { message, code } = result.error;
    throw new Error(`Failed to delete test car: ${message}, code: ${code}.`);
  }
}

async function addCoOwner(
  primaryOwner: ApiActor,
  carId: string,
  ownerId: string,
): Promise<void> {
  const response = await primaryOwner.request.post('/api/car/ownership', {
    data: { carId, ownerId },
  });

  if (!response.ok()) {
    throw new Error(`Failed to add test co-owner: ${response.status()}.`);
  }
}

async function removeCoOwner(
  primaryOwner: ApiActor,
  carId: string,
  ownerId: string,
): Promise<void> {
  const response = await primaryOwner.request.delete('/api/car/ownership', {
    data: { carId, ownerId },
  });

  if (!response.ok()) {
    throw new Error(`Failed to remove test co-owner: ${response.status()}.`);
  }
}

export type TestCarGraph = {
  primaryOwner: ApiActor;
  coOwner: ApiActor;
  stranger: ApiActor;
  carId: string;
};

export type TestServiceLogGraph = {
  primaryOwner: ApiActor;
  authorCoOwner: ApiActor;
  nonAuthorCoOwner: ApiActor;
  stranger: ApiActor;
  carId: string;
  serviceLogId: string;
};

async function buildTestCarGraph(): Promise<TestCarGraph> {
  const actors = await createApiActors(3);
  const [primaryOwner, coOwner, stranger] = actors;

  try {
    const addCarResponse = await primaryOwner.request.post('/api/car', {
      data: { customName: 'E2E write-flow car' },
    });

    if (!addCarResponse.ok()) {
      throw new Error(`Failed to create test car: ${addCarResponse.status()}.`);
    }

    const carId = await extractId(addCarResponse);

    await addCoOwner(primaryOwner, carId, coOwner.id);

    return { primaryOwner, coOwner, stranger, carId };
  } catch (error) {
    await Promise.all(actors.map(disposeApiActor));
    throw error;
  }
}

async function teardownTestCarGraph(graph: TestCarGraph): Promise<void> {
  await deleteTestCar(graph.carId);
  await Promise.all([
    disposeApiActor(graph.primaryOwner),
    disposeApiActor(graph.coOwner),
    disposeApiActor(graph.stranger),
  ]);
}

async function buildTestServiceLogGraph(): Promise<TestServiceLogGraph> {
  const actors = await createApiActors(4);
  const [primaryOwner, authorCoOwner, nonAuthorCoOwner, stranger] = actors;

  try {
    const addCarResponse = await primaryOwner.request.post('/api/car', {
      data: { customName: 'E2E write-flow car' },
    });

    if (!addCarResponse.ok()) {
      throw new Error(`Failed to create test car: ${addCarResponse.status()}.`);
    }

    const carId = await extractId(addCarResponse);

    await addCoOwner(primaryOwner, carId, authorCoOwner.id);
    await addCoOwner(primaryOwner, carId, nonAuthorCoOwner.id);

    const addServiceLogResponse = await authorCoOwner.request.post(
      '/api/car/service-log',
      {
        data: {
          carId,
          serviceDate: '2026-01-01',
          categories: ['other'],
        },
      },
    );

    if (!addServiceLogResponse.ok()) {
      throw new Error(
        `Failed to create test service log: ${addServiceLogResponse.status()}.`,
      );
    }

    const serviceLogId = await extractId(addServiceLogResponse);

    return {
      primaryOwner,
      authorCoOwner,
      nonAuthorCoOwner,
      stranger,
      carId,
      serviceLogId,
    };
  } catch (error) {
    await Promise.all(actors.map(disposeApiActor));
    throw error;
  }
}

async function teardownTestServiceLogGraph(
  graph: TestServiceLogGraph,
): Promise<void> {
  await deleteTestCar(graph.carId);
  await Promise.all([
    disposeApiActor(graph.primaryOwner),
    disposeApiActor(graph.authorCoOwner),
    disposeApiActor(graph.nonAuthorCoOwner),
    disposeApiActor(graph.stranger),
  ]);
}

export const carGraphTest = base.extend<{ testCarGraph: TestCarGraph }>({
  testCarGraph: async ({}, use) => {
    const graph = await buildTestCarGraph();
    await use(graph);
    await teardownTestCarGraph(graph);
  },
});

export const serviceLogGraphTest = base.extend<{
  testServiceLogGraph: TestServiceLogGraph;
}>({
  testServiceLogGraph: async ({}, use) => {
    const graph = await buildTestServiceLogGraph();
    await use(graph);
    await teardownTestServiceLogGraph(graph);
  },
});

export { addCoOwner, createApiActor, disposeApiActor, removeCoOwner };
export { expect } from '@playwright/test';
