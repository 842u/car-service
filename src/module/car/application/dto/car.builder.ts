import type { CarDto } from '@/car/application/dto/car';

export function buildCarDto(overrides?: Partial<CarDto>): CarDto {
  return {
    id: '6a6e49f5-9711-4a95-9fc2-3e14d0b5a4e6',
    imageUrl: 'https://example.com/car.png',
    customName: 'My Car',
    brand: 'Toyota',
    model: 'Corolla',
    licensePlates: 'ABC123',
    vin: '1HGCM82633A004352',
    fuelType: 'gasoline',
    additionalFuelType: 'LPG',
    transmissionType: 'manual',
    driveType: 'FWD',
    productionYear: 2020,
    engineCapacity: 1600,
    mileage: 50000,
    insuranceExpiration: '2026-01-01',
    technicalInspectionExpiration: '2026-06-01',
    createdAt: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}
