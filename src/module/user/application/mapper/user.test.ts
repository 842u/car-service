import { createMockAuthIdentity } from '@/lib/jest/mock/@supabase/auth';
import { UserMapper } from '@/user/application/mapper/user';

describe('UserMapper', () => {
  let mapper: UserMapper;

  beforeEach(() => {
    mapper = new UserMapper();
  });

  describe('authIdentityToDomain', () => {
    it('resolves the display name from the first valid metadata candidate', () => {
      const model = createMockAuthIdentity({
        email: 'user@email.com',
        user_metadata: { user_name: 'chosen_name', full_name: 'Ignored Name' },
      });

      const result = mapper.authIdentityToDomain(model);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name.value).toBe('chosen_name');
      }
    });

    it('falls through invalid metadata candidates to the email candidate', () => {
      const model = createMockAuthIdentity({
        email: 'user@email.com',
        user_metadata: { user_name: 'ab' },
      });

      const result = mapper.authIdentityToDomain(model);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name.value).toBe('user@email.com');
      }
    });

    it('falls back to an id-based name when no other candidate is valid', () => {
      const model = createMockAuthIdentity({
        id: '44dd8410-a912-480f-95be-9ad4cbe30d7f',
        // Valid email, but too long (>32) to be a valid name candidate.
        email: 'this-is-a-very-long-email-address@example.com',
        user_metadata: {},
      });

      const result = mapper.authIdentityToDomain(model);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name.value).toBe('user-44dd8410');
      }
    });

    it('fails when the auth identity has no email', () => {
      const model = createMockAuthIdentity({
        email: undefined,
        user_metadata: { user_name: 'chosen_name' },
      });

      const result = mapper.authIdentityToDomain(model);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Auth identity is missing an email.');
      }
    });
  });
});
