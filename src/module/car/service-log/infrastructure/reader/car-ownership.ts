import type { OwnershipRepository } from '@/car/ownership/application/repository/ownership';
import type { CarOwnershipReader } from '@/car/service-log/application/reader/car-ownership';

/**
 * Delegates to the existing OwnershipRepository rather than duplicating a
 * query, keeping Ownership's own repository as the single write/read path
 * over its table.
 */
export class CarOwnershipReaderImplementation implements CarOwnershipReader {
  private readonly _ownershipRepository: OwnershipRepository;

  constructor(ownershipRepository: OwnershipRepository) {
    this._ownershipRepository = ownershipRepository;
  }

  async getByCarId(carId: string) {
    return this._ownershipRepository.getByCarId(carId);
  }
}
