import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';

import { UserProfile } from '@/types/index';
import { getProfile } from '@/utils/supabase/general';

import { useUserProfile } from './useUserProfile';

const mockUserProfile = {
  avatar_url: 'url',
  id: 'id',
  username: 'username',
} as const satisfies UserProfile;

jest.mock('../utils/supabase/general.ts', () => ({
  fetchUserProfile: jest.fn(),
}));

function TestUseUserProfile() {
  const { userProfile } = useUserProfile();

  return (
    <>
      <p aria-label="user avatar">{userProfile.avatar_url}</p>
      <p aria-label="user id">{userProfile.id}</p>
      <p aria-label="username">{userProfile.username}</p>
    </>
  );
}

describe('useUserProfile', () => {
  it('should be initialized with an empty user profile', async () => {
    const { result } = renderHook(useUserProfile);

    await waitFor(() =>
      expect(result.current.userProfile.avatar_url).toBeNull(),
    );
    await waitFor(() => expect(result.current.userProfile.id).toBe(''));
    await waitFor(() => expect(result.current.userProfile.username).toBeNull());
  });

  it('should correctly set user profile', async () => {
    const { result } = renderHook(useUserProfile);

    act(() => result.current.setUserProfile(mockUserProfile));

    await waitFor(() =>
      expect(result.current.userProfile.avatar_url).toBe(
        mockUserProfile.avatar_url,
      ),
    );
    await waitFor(() =>
      expect(result.current.userProfile.id).toBe(mockUserProfile.id),
    );
    await waitFor(() =>
      expect(result.current.userProfile.username).toBe(
        mockUserProfile.username,
      ),
    );
  });

  it('should contain an empty user profile while there is no user session', async () => {
    (getProfile as jest.Mock).mockImplementationOnce(async () => undefined);
    render(<TestUseUserProfile />);

    const userAvatar = await screen.findByLabelText('user avatar');
    const userId = await screen.findByLabelText('user id');
    const username = await screen.findByLabelText('username');

    await waitFor(() => {
      expect(userAvatar).toBeEmptyDOMElement();
    });
    await waitFor(() => {
      expect(userId).toBeEmptyDOMElement();
    });
    await waitFor(() => {
      expect(username).toBeEmptyDOMElement();
    });
  });

  it('should contain user profile while a user is logged in', async () => {
    (getProfile as jest.Mock).mockImplementationOnce(
      async () => mockUserProfile,
    );
    render(<TestUseUserProfile />);

    const userAvatar = await screen.findByText(mockUserProfile.avatar_url);
    const userId = await screen.findByText(mockUserProfile.id);
    const username = await screen.findByText(mockUserProfile.username);

    await waitFor(() => {
      expect(userAvatar).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(userId).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(username).toBeInTheDocument();
    });
  });
});
