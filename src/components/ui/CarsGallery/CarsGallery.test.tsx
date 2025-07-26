import { render, screen } from '@testing-library/react';

import { SPINNER_TEST_ID } from '@/components/decorative/Spinner/Spinner';
import { TanStackQueryProvider } from '@/features/common/providers/TanStackQueryProvider';
import { Car } from '@/types';
import { getCarsByPage } from '@/utils/supabase/tables/cars';

import { CarsGallery } from './CarsGallery';

jest.mock('@/utils/supabase/tables/cars.ts', () => ({
  getCarsByPage: jest.fn(),
}));

function TestCarsGallery() {
  return (
    <TanStackQueryProvider>
      <CarsGallery />
    </TanStackQueryProvider>
  );
}

describe('CarsGallery', () => {
  it('should render as section', () => {
    render(<TestCarsGallery />);

    const section = screen.getByRole('region', { name: "user's cars" });

    expect(section).toBeInTheDocument();
  });

  it('should render loading spinner while fetching data', () => {
    render(<TestCarsGallery />);

    const spinner = screen.getByTestId(SPINNER_TEST_ID);

    expect(spinner).toBeInTheDocument();
  });

  it('should render information if the user has no cars', async () => {
    (getCarsByPage as jest.Mock).mockResolvedValueOnce({
      data: [],
      nextPageParam: 1,
    });
    render(<TestCarsGallery />);

    const info = await screen.findByText(
      (_, element) =>
        element?.textContent?.trim() === "Currently, you don't have cars.",
    );

    expect(info).toBeInTheDocument();
  });

  it('should render fetched cars', async () => {
    const mockedCars: Partial<Car>[] = [
      { id: 'car1', custom_name: 'car1' },
      { id: 'car2', custom_name: 'car2' },
    ];
    (getCarsByPage as jest.Mock).mockResolvedValueOnce({
      data: mockedCars,
      nextPageParam: 1,
    });
    render(<TestCarsGallery />);

    for await (const car of mockedCars) {
      if (!car.custom_name)
        throw new Error("Mocked car doesn't have a custom name.");

      const renderedCar = await screen.findByText(car.custom_name);

      expect(renderedCar).toBeInTheDocument();
    }
  });

  it('should render error message if error occurred while fetching cars', async () => {
    const errorMessage = 'Something went wrong.';
    (getCarsByPage as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    render(<TestCarsGallery />);

    const error = await screen.findByText(errorMessage);

    expect(error).toBeInTheDocument();
  });
});
