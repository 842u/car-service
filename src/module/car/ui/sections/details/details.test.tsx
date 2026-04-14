import { render, screen } from '@testing-library/react';

import { TanStackQueryProvider } from '@/common/presentation/provider/tan-stack-query';
import { createMockCar } from '@/lib/jest/mock/src/module/car/car';

import { DetailsSection } from './details';

function TestDetailsSection() {
  const mockCar = createMockCar();

  return (
    <TanStackQueryProvider>
      <DetailsSection carId={mockCar.id} />
    </TanStackQueryProvider>
  );
}

describe('DetailsSection', () => {
  it('should render section controls', () => {
    render(<TestDetailsSection />);

    const editCarButton = screen.getByRole('button', { name: 'Edit car' });

    expect(editCarButton).toBeInTheDocument();
  });

  it('edit car button should be disabled if !isCurrentUserPrimaryOwner', () => {
    render(<TestDetailsSection />);

    const editCarButton = screen.getByRole('button', { name: 'Edit car' });

    expect(editCarButton).toBeDisabled();
  });
});
