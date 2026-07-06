import { Name } from '@/user/domain/user/value-object/name/name';

describe('Name', () => {
  describe('fromCandidates', () => {
    it('returns the first candidate the value object accepts', () => {
      const result = Name.fromCandidates(['John', 'Jane']);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.value).toBe('John');
      }
    });

    it('skips a too-short candidate and falls through to the next valid one', () => {
      const result = Name.fromCandidates(['ab', 'Jane']);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.value).toBe('Jane');
      }
    });

    it('skips a too-long candidate and falls through to the next valid one', () => {
      const tooLong = 'a'.repeat(33);

      const result = Name.fromCandidates([tooLong, 'Jane']);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.value).toBe('Jane');
      }
    });

    it('fails when no candidate is valid', () => {
      const result = Name.fromCandidates(['ab', 'a'.repeat(33)]);

      expect(result.success).toBe(false);
    });

    it('fails when the candidate list is empty', () => {
      const result = Name.fromCandidates([]);

      expect(result.success).toBe(false);
    });
  });
});
