import { Result } from './index';

describe('Result', () => {
  describe('ok', () => {
    it('should create a success result with provided data', () => {
      const data = { name: 'test', age: 11 };

      const result = Result.ok(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(data);
      }
    });

    it('should spread metadata into the result', () => {
      const data = { name: 'test', age: 11 };
      const metadata = { role: 'test', email: 'test' };

      const result = Result.ok(data, metadata);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(data);
        expect(result?.role).toBe(metadata.role);
        expect(result?.email).toBe(metadata.email);
      }
    });
  });

  describe('fail', () => {
    it('should create a failure result with provided error', () => {
      const error = { message: 'Test error message.' };

      const result = Result.fail(error);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toEqual(error);
      }
    });

    it('should spread metadata into the result', () => {
      const error = { message: 'Test error message.' };
      const metadata = { role: 'test', email: 'test' };

      const result = Result.fail(error, metadata);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toEqual(error);
        expect(result?.role).toBe(metadata.role);
        expect(result?.email).toBe(metadata.email);
      }
    });
  });

  describe('return type narrowing', () => {
    it('should narrow types correctly in success case', () => {
      const data = 'test data';
      const result = Result.ok(data);

      if (result.success) {
        expect(result.data).toBe(data);
        expect(result).not.toHaveProperty('error');
      } else {
        fail('Expected success result');
      }
    });

    it('should narrow types correctly in failure case', () => {
      const error = 'test error';
      const result = Result.fail(error);

      if (!result.success) {
        expect(result.error).toBe(error);
        expect(result).not.toHaveProperty('data');
      } else {
        fail('Expected success result');
      }
    });
  });
});
