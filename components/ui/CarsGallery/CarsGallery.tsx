import { Spinner } from '../../decorative/Spinner/Spinner';
import { CarCard } from '../shared/CarCard/CarCard';
import { useCarsGallery } from './useCarsGallery';

export function CarsGallery() {
  const {
    data,
    error,
    isError,
    isPending,
    hasNoCars,
    isSuccess,
    intersectionTargetRef,
    isFetchingNextPage,
  } = useCarsGallery();

  return (
    <section aria-label="user's cars">
      {isError && <p>{error?.message}</p>}
      {isPending && (
        <Spinner className="stroke-accent-400 fill-accent-400 h-16 md:h-20 lg:h-24" />
      )}
      {hasNoCars && (
        <p>
          <span className="block text-center">
            Currently, you don&apos;t have cars.{' '}
          </span>
          <span className="block text-center">Feel free to add one.</span>
        </p>
      )}
      {isSuccess && (
        <div className="relative flex flex-col gap-5 py-5 md:flex-row md:flex-wrap md:justify-center lg:max-w-[1920px]">
          {data?.pages.map((page) => {
            return page.data.map(
              (car) => car && <CarCard key={car.id} car={car} />,
            );
          })}
          <div
            ref={intersectionTargetRef}
            className="absolute bottom-0 left-0 -z-10 h-[30vh] w-full"
          />
          {isFetchingNextPage && (
            <Spinner className="stroke-accent-400 fill-accent-400 my-10 h-16 w-full" />
          )}
        </div>
      )}
    </section>
  );
}
