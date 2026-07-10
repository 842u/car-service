import type { Car } from '@/car/domain/car/car';
import type {
  Repository,
  RepositoryResult,
} from '@/common/application/repository';

export interface CarRepository extends Repository<Car> {
  getById(id: string): Promise<RepositoryResult<Car>>;
}
