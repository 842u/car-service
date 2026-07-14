import type { CarOwnershipReader } from '@/car/service-log/application/reader/car-ownership';

export function createMockCarOwnershipReader() {
  return {
    getByCarId: jest.fn(),
  } as unknown as jest.Mocked<CarOwnershipReader>;
}
