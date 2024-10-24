import { render, screen } from '@testing-library/react';

import { USER_ICON_TEST_ID } from '@/components/decorative/icons/UserIcon';

import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('should render an image if the image source is provided', () => {
    const imgSrc = '/some/url';
    render(<Avatar src={imgSrc} />);

    const imgElement = screen.getByRole('img', { name: 'user avatar' });

    expect(imgElement).toBeInTheDocument();
  });

  it('should render a placeholder if the image source is an empty string', () => {
    const imgSrc = '';
    render(<Avatar src={imgSrc} />);

    const placeholder = screen.getByTestId(USER_ICON_TEST_ID);

    expect(placeholder).toBeInTheDocument();
  });

  it('should render a placeholder if the image source is undefined', () => {
    const imgSrc = undefined;
    render(<Avatar src={imgSrc} />);

    const placeholder = screen.getByTestId(USER_ICON_TEST_ID);

    expect(placeholder).toBeInTheDocument();
  });
});
