import type { CarOwnership, Profile } from '@/types';

export const MOCK_CAR_ID = '2c7e021f-fdf7-4a67-aef9-35fa96164864';

export const MOCK_MAIN_OWNER_PROFILE: Profile = {
  avatar_url: 'http://some.url',
  id: 'a9132b5f-12d1-4cb6-955c-4e5d1733d1b1',
  username: 'test user',
};

export const MOCK_OWNERS_PROFILES: Profile[] = [MOCK_MAIN_OWNER_PROFILE];

export const MOCK_OWNERSHIPS: CarOwnership[] = [
  {
    car_id: MOCK_CAR_ID,
    created_at: new Date().toISOString(),
    is_primary_owner: true,
    owner_id: MOCK_MAIN_OWNER_PROFILE.id,
  },
];

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(() => ({
    from: () => ({
      select: () => ({
        eq: () => ({}),
      }),
    }),

    auth: {
      resetPasswordForEmail: () => ({ data: {}, error: null }),
      getUser: async () =>
        Promise.resolve({
          data: {
            user: { id: MOCK_MAIN_OWNER_PROFILE.id },
          },
        }),
    },
  })),
}));
