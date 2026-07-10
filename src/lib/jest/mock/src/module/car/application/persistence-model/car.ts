import type { CarPersistence } from '@/car/application/persistence-model/car';

export function createMockCarPersistence(
  overrides?: Partial<CarPersistence>,
): CarPersistence {
  return {
    id: '6a6e49f5-9711-4a95-9fc2-3e14d0b5a4e6',
    image_url: 'https://example.com/car.png',
    custom_name: 'My Car',
    brand: 'Toyota',
    model: 'Corolla',
    license_plates: 'ABC123',
    vin: '1HGCM82633A004352',
    fuel_type: 'gasoline',
    additional_fuel_type: 'LPG',
    transmission_type: 'manual',
    drive_type: 'FWD',
    production_year: 2020,
    engine_capacity: 1600,
    mileage: 50000,
    insurance_expiration: '2026-01-01',
    technical_inspection_expiration: '2026-06-01',
    created_at: '2024-01-01T00:00:00Z',
    created_by: '44dd8410-a912-480f-95be-9ad4cbe30d7f',
    ...overrides,
  };
}
