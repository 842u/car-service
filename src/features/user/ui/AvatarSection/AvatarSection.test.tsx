import { render, screen, waitFor } from '@testing-library/react';

import { TanStackQueryProvider } from '@/features/common/providers/tan-stack-query';

import { AVATAR_FORM_TEST_ID } from '../AvatarForm/AvatarForm';
import { AvatarSection } from './AvatarSection';

function TestAvatarSection() {
  return (
    <TanStackQueryProvider>
      <AvatarSection />
    </TanStackQueryProvider>
  );
}

describe('AvatarSection', () => {
  it('should render a section heading', async () => {
    render(<TestAvatarSection />);

    const heading = screen.getByRole('heading', { name: 'Avatar' });

    await waitFor(() => expect(heading).toBeInTheDocument());
  });

  it('should render info about usage', async () => {
    render(<TestAvatarSection />);

    const usageInfo = screen.getByText(
      'Click on the image to upload a custom one.',
    );

    await waitFor(() => expect(usageInfo).toBeInTheDocument());
  });

  it('should render info about file constraints', async () => {
    render(<TestAvatarSection />);

    const fileTypeInfo = screen.getByText(/file types/i);
    const fileSizeInfo = screen.getByText(/file size/i);

    await waitFor(() => expect(fileTypeInfo).toBeInTheDocument());
    await waitFor(() => expect(fileSizeInfo).toBeInTheDocument());
  });

  it('should render avatar form', async () => {
    render(<TestAvatarSection />);

    const avatarForm = screen.getByTestId(AVATAR_FORM_TEST_ID);

    await waitFor(() => expect(avatarForm).toBeInTheDocument());
  });
});
