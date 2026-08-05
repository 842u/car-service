import { useEffect, useRef } from 'react';

export type UseInfiniteScrollTriggerParams = {
  hasNextPage: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  isSuccess: boolean;
  fetchNextPage: () => unknown;
  threshold?: number;
};

export function useInfiniteScrollTrigger<TElement extends Element>({
  hasNextPage,
  isFetching,
  isFetchingNextPage,
  isSuccess,
  fetchNextPage,
  threshold = 0,
}: UseInfiniteScrollTriggerParams) {
  const intersectionTargetRef = useRef<TElement>(null);

  useEffect(() => {
    const target = intersectionTargetRef.current;
    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          isSuccess && !isFetching && !isFetchingNextPage && fetchNextPage();
        }
      },
      { threshold },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isSuccess,
    threshold,
  ]);

  return intersectionTargetRef;
}
