import { CarImage } from '@/car/presentation/ui/image/image';
import { Badge } from '@/ui/badge/badge';

type CarBadgeProps = {
  name: string;
  imageUrl?: string | null;
  className?: string;
};

export function CarBadge({ name, imageUrl, className }: CarBadgeProps) {
  return (
    <Badge
      className={className}
      image={<CarImage src={imageUrl} />}
      label={name}
    />
  );
}
