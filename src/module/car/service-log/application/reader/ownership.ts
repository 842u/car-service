import type { Ownership } from '@/car/ownership/domain/ownership/ownership';
import type { RepositoryResult } from '@/common/application/repository';

/**
 * Read-only port into the Ownership aggregate. Narrower than a repository:
 * Service Log needs to read a car's Ownership to authorize writes, but must
 * not depend on Ownership's own repository or persistence wiring directly.
 */
export interface OwnershipReader {
  getByCarId(carId: string): Promise<RepositoryResult<Ownership>>;
}
