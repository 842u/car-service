import type { CarProvisioning } from '@/car/application/provisioning/car';

export function createMockCarProvisioning() {
  return {
    createWithPrimaryOwner: jest.fn(),
  } as unknown as jest.Mocked<CarProvisioning>;
}
