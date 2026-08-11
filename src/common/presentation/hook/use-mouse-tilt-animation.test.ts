import { renderHook } from '@testing-library/react';
import type { MouseEvent } from 'react';

import { useMouseTiltAnimation } from './use-mouse-tilt-animation';

const mockUseReducedMotion = jest.fn();
jest.mock('motion/react', () => ({
  ...jest.requireActual('motion/react'),
  useReducedMotion: () => mockUseReducedMotion(),
}));

function createMouseEvent(clientX: number, clientY: number) {
  return { clientX, clientY } as MouseEvent<HTMLDivElement>;
}

describe('useMouseTiltAnimation', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false);
  });

  it('reads the element bounds on mouse move by default', () => {
    const { result } = renderHook(() =>
      useMouseTiltAnimation<HTMLDivElement>({}),
    );
    const getBoundingClientRect = jest
      .fn()
      .mockReturnValue({ left: 0, top: 0, width: 100, height: 100 });
    result.current.elementRef.current = {
      getBoundingClientRect,
    } as unknown as HTMLDivElement;

    result.current.handleMouseMove(createMouseEvent(50, 50));

    expect(getBoundingClientRect).toHaveBeenCalled();
  });

  it('does not read the element bounds when reduced motion is preferred', () => {
    mockUseReducedMotion.mockReturnValue(true);

    const { result } = renderHook(() =>
      useMouseTiltAnimation<HTMLDivElement>({}),
    );
    const getBoundingClientRect = jest
      .fn()
      .mockReturnValue({ left: 0, top: 0, width: 100, height: 100 });
    result.current.elementRef.current = {
      getBoundingClientRect,
    } as unknown as HTMLDivElement;

    result.current.handleMouseMove(createMouseEvent(50, 50));

    expect(getBoundingClientRect).not.toHaveBeenCalled();
  });
});
