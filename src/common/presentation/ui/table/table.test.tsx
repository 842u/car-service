import { renderHook } from '@testing-library/react';

import { useTable } from './table';

describe('useTable', () => {
  it('should throw when used outside a Table context', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => renderHook(() => useTable())).toThrow();

    consoleSpy.mockRestore();
  });
});
