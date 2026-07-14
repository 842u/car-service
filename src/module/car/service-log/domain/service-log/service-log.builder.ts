import { ServiceLog } from '@/car/service-log/domain/service-log/service-log';

export function buildServiceLog({
  id = '11111111-1111-4111-8111-111111111111',
  carId = '5202140b-aa28-4058-9191-e4a117e15353',
  authorId = 'b5b55395-e32f-4376-be03-f66be0a63ec4',
  serviceDate = '2024-01-01',
  categories = ['engine'],
  mileage = 100000,
  note = null,
  serviceCost = 100,
}: {
  id?: string;
  carId?: string;
  authorId?: string;
  serviceDate?: string;
  categories?: string[];
  mileage?: number | null;
  note?: string | null;
  serviceCost?: number | null;
} = {}): ServiceLog {
  const serviceLogResult = ServiceLog.create({
    id,
    carId,
    authorId,
    serviceDate,
    categories,
    mileage,
    note,
    serviceCost,
  });

  if (!serviceLogResult.success) {
    throw new Error('Failed to create mock service log');
  }

  return serviceLogResult.data;
}
