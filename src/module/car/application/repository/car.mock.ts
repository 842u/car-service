import { jest } from '@jest/globals';

import type { CarRepository } from '@/car/application/repository/car';

export function createMockCarRepository(): jest.Mocked<CarRepository> {
  return {
    getById: jest.fn<CarRepository['getById']>(),
    update: jest.fn<CarRepository['update']>(),
    store: jest.fn<CarRepository['store']>(),
    remove: jest.fn<CarRepository['remove']>(),
  };
}
