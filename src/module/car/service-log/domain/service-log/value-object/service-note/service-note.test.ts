import { ServiceNote } from '@/car/service-log/domain/service-log/value-object/service-note/service-note';
import { MAX_SERVICE_NOTE_LENGTH } from '@/car/service-log/domain/service-log/value-object/service-note/service-note.schema';

describe('ServiceNote', () => {
  it('accepts a valid note', () => {
    const result = ServiceNote.create('Replaced brake pads.');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.value).toBe('Replaced brake pads.');
    }
  });

  it('trims surrounding whitespace', () => {
    const result = ServiceNote.create('  padded  ');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.value).toBe('padded');
    }
  });

  it('accepts an empty note', () => {
    const result = ServiceNote.create('');

    expect(result.success).toBe(true);
  });

  it('rejects a note longer than the maximum length', () => {
    const result = ServiceNote.create('a'.repeat(MAX_SERVICE_NOTE_LENGTH + 1));

    expect(result.success).toBe(false);
  });
});
