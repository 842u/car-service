import { render, screen } from '@testing-library/react';

import { USER_ICON_TEST_ID } from '@/features/common/ui/decorative/icons/UserIcon';

import { AvatarImage } from './AvatarImage';

const MOCK_SRC = 'http://test.url';

describe('AvatarImage', () => {
  it('should render default icon if no src provided', () => {
    render(<AvatarImage />);

    const defaultIcon = screen.getByTestId(USER_ICON_TEST_ID);

    expect(defaultIcon).toBeInTheDocument();
  });

  it('should render an image if src is provided', () => {
    render(<AvatarImage src={MOCK_SRC} />);

    const image = screen.getByRole('img', { name: 'avatar image' });

    expect(image).toBeInTheDocument();
  });
});
