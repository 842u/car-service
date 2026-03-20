import { Spinner } from '@/ui/decorative/spinner/spinner';

import { CarCard } from '../card/card';
import { useCarsGallery } from './use-cars-gallery';

export function CarsGallery() {
  const { data, isPending, intersectionTargetRef, isFetchingNextPage } =
    useCarsGallery();

  if (isPending)
    return (
      <Spinner className="stroke-accent-400 fill-accent-400 h-16 md:h-20 lg:h-24" />
    );

  if (!data || !data.length)
    return (
      <p>
        <span className="block text-center">
          Currently, you don&apos;t have cars.{' '}
        </span>
        <span className="block text-center">Feel free to add one.</span>
      </p>
    );

  return (
    <section aria-label="user's cars">
      <div className="relative flex flex-col gap-5 py-5 md:flex-row md:flex-wrap md:justify-center lg:max-w-480">
        {data.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
        <div
          ref={intersectionTargetRef}
          className="absolute bottom-0 left-0 -z-10 h-[30vh] w-full"
        />
        {isFetchingNextPage && (
          <Spinner className="stroke-accent-400 fill-accent-400 my-10 h-16 w-full" />
        )}
      </div>
    </section>
  );
}
