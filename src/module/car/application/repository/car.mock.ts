import type { CarRepository } from '@/car/application/repository/car';

export function createMockCarRepository() {
  return {
    getById: jest.fn(),
    update: jest.fn(),
    store: jest.fn(),
    remove: jest.fn(),
  } as unknown as jest.Mocked<CarRepository>;
}
