import { buildUser } from '@/user/domain/user/user.builder';

describe('User', () => {
  describe('edit', () => {
    it('changes the name when present', () => {
      const user = buildUser({ name: 'Original Name' });

      const result = user.edit({ name: 'New Name' });

      expect(result.success).toBe(true);
      expect(user.name.value).toBe('New Name');
    });

    it('leaves the name untouched when absent', () => {
      const user = buildUser({ name: 'Original Name' });

      const result = user.edit({});

      expect(result.success).toBe(true);
      expect(user.name.value).toBe('Original Name');
    });

    it('rejects an invalid name and leaves the user unchanged', () => {
      const user = buildUser({ name: 'Original Name' });

      const result = user.edit({ name: '' });

      expect(result.success).toBe(false);
      expect(user.name.value).toBe('Original Name');
    });

    it('sets the avatar url when present', () => {
      const user = buildUser();

      const result = user.edit({ avatarUrl: 'https://cdn.test/avatar.png' });

      expect(result.success).toBe(true);
      expect(user.avatarUrl?.value).toBe('https://cdn.test/avatar.png');
    });

    it('clears the avatar url when explicitly null', () => {
      const user = buildUser();
      user.changeAvatarUrl('https://cdn.test/avatar.png');

      const result = user.edit({ avatarUrl: null });

      expect(result.success).toBe(true);
      expect(user.avatarUrl).toBeNull();
    });

    it('leaves the avatar url untouched when absent', () => {
      const user = buildUser();
      user.changeAvatarUrl('https://cdn.test/avatar.png');

      const result = user.edit({ name: 'New Name' });

      expect(result.success).toBe(true);
      expect(user.avatarUrl?.value).toBe('https://cdn.test/avatar.png');
    });

    it('rejects an empty avatar url instead of treating it as a clear', () => {
      const user = buildUser();
      user.changeAvatarUrl('https://cdn.test/avatar.png');

      const result = user.edit({ avatarUrl: '' });

      expect(result.success).toBe(false);
      expect(user.avatarUrl?.value).toBe('https://cdn.test/avatar.png');
    });

    it('changes both fields together', () => {
      const user = buildUser({ name: 'Original Name' });

      const result = user.edit({
        name: 'New Name',
        avatarUrl: 'https://cdn.test/avatar.png',
      });

      expect(result.success).toBe(true);
      expect(user.name.value).toBe('New Name');
      expect(user.avatarUrl?.value).toBe('https://cdn.test/avatar.png');
    });

    it('changes nothing when no fields are present', () => {
      const user = buildUser({ name: 'Original Name' });

      const result = user.edit({});

      expect(result.success).toBe(true);
      expect(user.name.value).toBe('Original Name');
      expect(user.avatarUrl).toBeNull();
    });

    it('validates every present field before mutating any of them', () => {
      const user = buildUser({ name: 'Original Name' });
      user.changeAvatarUrl('https://cdn.test/avatar.png');

      const result = user.edit({
        name: 'New Name',
        avatarUrl: 'not-a-url',
      });

      expect(result.success).toBe(false);
      expect(user.name.value).toBe('Original Name');
      expect(user.avatarUrl?.value).toBe('https://cdn.test/avatar.png');
    });
  });
});
