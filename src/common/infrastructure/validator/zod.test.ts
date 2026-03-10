import { z } from 'zod';

import { ValidatorError } from '@/common/application/validator';

import { ZodValidator } from './zod';

describe('ZodValidator', () => {
  let validator: ZodValidator;

  beforeEach(() => {
    validator = new ZodValidator();
  });

  describe('validate', () => {
    it('should return success result when validation passes', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const validData = { name: 'test', age: 30 };

      const result = validator.validate(validData, schema);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should return failure result when validation fails', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const invalidData = { name: 'test', age: 'string' };

      const result = validator.validate(invalidData, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidatorError);
        expect(result.error.message).not.toBeUndefined();
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    it('should use custom error message when provided', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const invalidData = { name: 'test', age: 'string' };
      const customMessage = 'Test error message.';

      const result = validator.validate(invalidData, schema, customMessage);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(customMessage);
      }
    });

    it('should include validation issues with paths and messages', () => {
      const schema = z.object({
        name: z.string().min(1),
        age: z.number().positive(),
      });

      const invalidData = { name: '', age: -5 };

      const result = validator.validate(invalidData, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(2);

        const nameIssue = result.error.issues.find(
          (issue) => issue.path[0] === 'name',
        );
        expect(nameIssue).toBeDefined();
        expect(nameIssue?.message).toBeTruthy();

        const ageIssue = result.error.issues.find(
          (issue) => issue.path[0] === 'age',
        );
        expect(ageIssue).toBeDefined();
        expect(ageIssue?.message).toBeTruthy();
      }
    });
  });
});
