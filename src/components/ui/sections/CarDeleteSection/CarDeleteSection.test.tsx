import { render, screen } from '@testing-library/react';

import { TanStackQueryProvider } from '@/features/common/providers/TanStackQueryProvider';

import { CAR_DELETE_MODAL_TEST_ID } from '../../modals/CarDeleteModal/CarDeleteModal';
import { CarDeleteSection } from './CarDeleteSection';

const MOCK_CAR_ID = 'e5e42160-6e96-4641-8484-b851aec4167f';

function TestCarDeleteSection({
  isCurrentUserPrimaryOwner = true,
}: {
  isCurrentUserPrimaryOwner?: boolean;
}) {
  return (
    <TanStackQueryProvider>
      <CarDeleteSection
        carId={MOCK_CAR_ID}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
    </TanStackQueryProvider>
  );
}

describe('CarDeleteSection', () => {
  it('should render a heading', () => {
    render(<TestCarDeleteSection />);

    const heading = screen.getByRole('heading', { name: 'Delete Car' });

    expect(heading).toBeInTheDocument();
  });

  it('should render information about usage', () => {
    render(<TestCarDeleteSection />);

    const usageInfo = screen.getByText(
      'Permanently delete this car for you and other owners.',
    );

    expect(usageInfo).toBeInTheDocument();
  });

  it('should render warning information', () => {
    render(<TestCarDeleteSection />);

    const warningInfo = screen.getByText(
      'This action is irreversible and can not be undone.',
    );

    expect(warningInfo).toBeInTheDocument();
  });

  it('should render additional information', () => {
    render(<TestCarDeleteSection />);

    const additionalInfo = screen.getByText(
      'If you do not want to see that car you can pass primary ownership to someone else and remove yourself from the owners list.',
    );

    expect(additionalInfo).toBeInTheDocument();
  });

  it('should render delete button', () => {
    render(<TestCarDeleteSection />);

    const deleteButton = screen.getByRole('button', { name: 'Delete car' });

    expect(deleteButton).toBeInTheDocument();
  });

  it('delete button should be disabled if !isCurrentUserPrimaryOwner', () => {
    render(<TestCarDeleteSection isCurrentUserPrimaryOwner={false} />);

    const deleteButton = screen.getByRole('button', { name: 'Delete car' });

    expect(deleteButton).toBeDisabled();
  });

  it('should render a car delete modal', () => {
    render(<TestCarDeleteSection />);

    const modal = screen.getByTestId(CAR_DELETE_MODAL_TEST_ID);

    expect(modal).toBeInTheDocument();
  });
});
