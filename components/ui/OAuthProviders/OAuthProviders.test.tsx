import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { signInWithOAuthHandler } from '@/utils/general';

import { OAuthProviders } from './OAuthProviders';

jest.mock('../../../utils/general.ts', () => ({
  signInWithOAuthHandler: jest.fn(),
}));

describe('OAuthProviders', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a button for github provider', () => {
    render(<OAuthProviders />);

    const githubButton = screen.getByRole('button', { name: /github/i });

    expect(githubButton).toBeInTheDocument();
  });

  it('should render a button for google provider ', () => {
    render(<OAuthProviders />);

    const googleButton = screen.getByRole('button', { name: /google/i });

    expect(googleButton).toBeInTheDocument();
  });

  it('should call github OAuth handler on github button click', async () => {
    const user = userEvent.setup();
    (signInWithOAuthHandler as jest.Mock).mockImplementation(() => ({}));
    render(<OAuthProviders />);

    const githubButton = screen.getByRole('button', { name: /github/i });
    await user.click(githubButton);

    expect(signInWithOAuthHandler).toHaveBeenCalledTimes(1);
    expect(signInWithOAuthHandler).toHaveBeenCalledWith('github');
  });

  it('should call google OAuth handler on google button click', async () => {
    const user = userEvent.setup();
    (signInWithOAuthHandler as jest.Mock).mockImplementation(() => ({}));
    render(<OAuthProviders />);

    const googleButton = screen.getByRole('button', { name: /google/i });
    await user.click(googleButton);

    expect(signInWithOAuthHandler).toHaveBeenCalledTimes(1);
    expect(signInWithOAuthHandler).toHaveBeenCalledWith('google');
  });
});
