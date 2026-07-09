import { Car } from '@/car/domain/car/car';

export function createMockCar({
  id = '6a6e49f5-9711-4a95-9fc2-3e14d0b5a4e6',
  customName = 'My Car',
}: { id?: string; customName?: string } = {}): Car {
  const carResult = Car.create({ id, customName });

  if (!carResult.success) {
    throw new Error('Failed to create mock car');
  }

  return carResult.data;
}
