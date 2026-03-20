import { CarsGallery } from '@/car/ui/cars-gallery/cars-gallery';
import { DashboardMain } from '@/dashboard/ui/main/main';

export default function CarsPage() {
  return (
    <DashboardMain>
      <CarsGallery />
    </DashboardMain>
  );
}
