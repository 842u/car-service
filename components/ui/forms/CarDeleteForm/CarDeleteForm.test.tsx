import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TanStackQueryProvider } from '@/components/providers/TanStackQueryProvider';
import { deleteCar } from '@/utils/supabase/tables/cars';

import { CarDeleteForm } from './CarDeleteForm';

jest.mock('@/utils/supabase/tables/cars', () => ({
  deleteCar: jest.fn(),
}));

function TestCarDeleteForm() {
  return (
    <TanStackQueryProvider>
      <CarDeleteForm carId="someId" onSubmit={() => {}} />
    </TanStackQueryProvider>
  );
}

describe('CarDeleteFom', () => {
  it('should render a delete button', () => {
    render(<TestCarDeleteForm />);

    const deleteButton = screen.getByRole('button', { name: 'Delete' });

    expect(deleteButton).toBeInTheDocument();
  });

  it('should call submit handler on delete button click', async () => {
    const user = userEvent.setup();
    render(<TestCarDeleteForm />);

    const deleteButton = screen.getByRole('button', { name: 'Delete' });

    await user.click(deleteButton);

    expect(deleteCar).toHaveBeenCalled();
  });
});
