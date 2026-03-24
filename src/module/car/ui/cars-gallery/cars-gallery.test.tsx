import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { createMockCar } from '@/lib/jest/mock/src/module/car/car';
import { getCarsByPage } from '@/lib/supabase/tables/cars';
import { SPINNER_TEST_ID } from '@/ui/decorative/spinner/spinner';

import { CarsGallery } from './cars-gallery';

const mockGetCarsByPage = getCarsByPage as jest.MockedFunction<
  typeof getCarsByPage
>;
jest.mock('@/lib/supabase/tables/cars');

const mockAddToast = jest.fn();
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

jest.mock('@/car/ui/cards/add/add', () => ({
  AddCard: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick}>Add car</button>
  ),
}));
jest.mock('../cards/car', () => ({
  CarCard: ({ car }: { car: { id: string } }) => <div>{car.id}</div>,
}));
jest.mock('@/car/ui/modals/add/add', () => ({
  AddModal: () => null,
}));
jest.mock('@/dashboard/ui/section/section', () => ({
  DashboardSection: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));
const DashboardSectionMock = jest.requireMock(
  '@/dashboard/ui/section/section',
).DashboardSection;
DashboardSectionMock.Heading = function DashboardSectionHeading({
  children,
}: {
  children: ReactNode;
}) {
  return <h2>{children}</h2>;
};

const MOCK_CARS = [createMockCar({ id: crypto.randomUUID() }), createMockCar()];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return Wrapper;
}

/**
 * 1. IntersectionObserver is replaced with a jest.fn() in globalThis setup, so
 *    every call to `new IntersectionObserver(callback)` is tracked by Jest.
 * 2. `.mock.results[0].value` retrieves the MockIntersectionObserver instance
 *    returned by that call the same instance the hook holds internally, with
 *    the callback attached via its constructor.
 * 3. Invoke that callback manually with a minimal IntersectionObserverEntry,
 *    simulating exactly what the browser would do when the observed element
 *    intersects the viewport.
 */
function triggerIntersection(isIntersecting: boolean) {
  const instance = (IntersectionObserver as unknown as jest.Mock).mock
    .results[0].value as MockIntersectionObserver;

  instance.callback(
    [{ isIntersecting } as IntersectionObserverEntry],
    instance,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CarsGallery', () => {
  it('should render spinner while pending', () => {
    mockGetCarsByPage.mockReturnValue(new Promise(() => {}));

    render(<CarsGallery />, { wrapper: createWrapper() });

    expect(screen.getByTestId(SPINNER_TEST_ID)).toBeInTheDocument();
  });

  it('should not render spinner after data loads', async () => {
    mockGetCarsByPage.mockResolvedValue({
      data: MOCK_CARS,
      nextPageParam: null,
    });

    render(<CarsGallery />, { wrapper: createWrapper() });

    await waitFor(() =>
      expect(screen.queryByTestId(SPINNER_TEST_ID)).not.toBeInTheDocument(),
    );
  });

  it('should render heading', async () => {
    mockGetCarsByPage.mockReturnValue(new Promise(() => {}));

    render(<CarsGallery />, { wrapper: createWrapper() });

    expect(screen.getByText('Cars')).toBeInTheDocument();
  });

  it('should render a CarCard for each car', async () => {
    mockGetCarsByPage.mockResolvedValue({
      data: MOCK_CARS,
      nextPageParam: null,
    });

    render(<CarsGallery />, { wrapper: createWrapper() });

    expect(await screen.findByText(MOCK_CARS[0].id)).toBeInTheDocument();

    MOCK_CARS.forEach((car) => {
      expect(screen.getByText(car.id)).toBeInTheDocument();
    });
  });

  it('should render add car card', async () => {
    mockGetCarsByPage.mockResolvedValue({
      data: MOCK_CARS,
      nextPageParam: null,
    });

    render(<CarsGallery />, { wrapper: createWrapper() });

    expect(await screen.findByText('Add car')).toBeInTheDocument();
  });

  it('should render fetching spinner when fetching next page', async () => {
    mockGetCarsByPage
      .mockResolvedValueOnce({ data: MOCK_CARS, nextPageParam: 1 })
      .mockReturnValueOnce(new Promise(() => {}));

    render(<CarsGallery />, { wrapper: createWrapper() });

    await waitFor(() =>
      expect(screen.queryByTestId(SPINNER_TEST_ID)).not.toBeInTheDocument(),
    );

    triggerIntersection(true);

    expect(await screen.findByTestId(SPINNER_TEST_ID)).toBeInTheDocument();
  });
});
