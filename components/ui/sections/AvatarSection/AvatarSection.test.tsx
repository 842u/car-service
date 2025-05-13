import { render, screen } from '@testing-library/react';

import { TanStackQueryProvider } from '@/components/providers/TanStackQueryProvider';

import { AVATAR_FORM_TEST_ID } from '../../forms/AvatarForm/AvatarForm';
import { AvatarSection } from './AvatarSection';

function TestAvatarSection() {
  return (
    <TanStackQueryProvider>
      <AvatarSection />
    </TanStackQueryProvider>
  );
}

describe('AvatarSection', () => {
  it('should render a section heading', () => {
    render(<TestAvatarSection />);

    const heading = screen.getByRole('heading', { name: 'Avatar' });

    expect(heading).toBeInTheDocument();
  });

  it('should render info about usage', () => {
    render(<TestAvatarSection />);

    const usageInfo = screen.getByText(
      'Click on the image to upload a custom one.',
    );

    expect(usageInfo).toBeInTheDocument();
  });

  it('should render info about file constraints', () => {
    render(<TestAvatarSection />);

    const fileTypeInfo = screen.getByText(/file types/i);
    const fileSizeInfo = screen.getByText(/file size/i);

    expect(fileTypeInfo).toBeInTheDocument();
    expect(fileSizeInfo).toBeInTheDocument();
  });

  it('should render avatar form', () => {
    render(<TestAvatarSection />);

    const avatarForm = screen.getByTestId(AVATAR_FORM_TEST_ID);

    expect(avatarForm).toBeInTheDocument();
  });
});
