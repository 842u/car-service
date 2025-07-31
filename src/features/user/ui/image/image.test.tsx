import { render, screen } from '@testing-library/react';

import { USER_ICON_TEST_ID } from '@/icons/user';

import { UserImage } from './image';

const MOCK_SRC = 'http://test.url';

describe('UserImage', () => {
  it('should render default icon if no src provided', () => {
    render(<UserImage />);

    const defaultIcon = screen.getByTestId(USER_ICON_TEST_ID);

    expect(defaultIcon).toBeInTheDocument();
  });

  it('should render an image if src is provided', () => {
    render(<UserImage src={MOCK_SRC} />);

    const image = screen.getByRole('img', { name: 'avatar image' });

    expect(image).toBeInTheDocument();
  });
});
