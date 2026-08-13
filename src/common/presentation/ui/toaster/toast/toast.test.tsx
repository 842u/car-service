import { render, screen } from '@testing-library/react';

import type { ToastType } from './toast';
import { ToasterToast } from './toast';

const mockUseReducedMotion = jest.fn();
jest.mock('motion/react', () => ({
  ...jest.requireActual('motion/react'),
  useReducedMotion: () => mockUseReducedMotion(),
}));

const defaultProps = {
  paused: false,
  toastLifeTime: 6000,
  onRemove: jest.fn(),
};

describe('ToasterToast', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false);
  });

  it('should render a button to close the toast', () => {
    render(
      <ToasterToast {...defaultProps} id="id" message="Toast" type="error" />,
    );

    const closeButton = screen.getByRole('button', { name: /close/i });

    expect(closeButton).toBeInTheDocument();
  });

  it('should render provided message', () => {
    const toastMessage = 'test';
    const regexp = new RegExp(toastMessage, 'i');
    render(
      <ToasterToast
        {...defaultProps}
        id="id"
        message={toastMessage}
        type="error"
      />,
    );

    const toast = screen.getByRole('listitem');

    expect(toast).toHaveTextContent(regexp);
  });

  it('should render the toast of proper type', () => {
    const toastTypes: ToastType[] = ['error', 'info', 'success', 'warning'];
    toastTypes.forEach((type) => {
      const regexp = new RegExp(`${type}:`, 'i');
      const { unmount } = render(
        <ToasterToast {...defaultProps} id="id" message="Toast" type={type} />,
      );

      const toast = screen.getByRole('listitem');

      expect(toast).toHaveTextContent(regexp);
      unmount();
    });
  });

  it('should scale in and out by default', () => {
    render(
      <ToasterToast {...defaultProps} id="id" message="Toast" type="error" />,
    );

    const toast = screen.getByRole('listitem');

    expect(toast.style.transform).toContain('scale');
  });

  it('should not scale when reduced motion is preferred', () => {
    mockUseReducedMotion.mockReturnValue(true);

    render(
      <ToasterToast {...defaultProps} id="id" message="Toast" type="error" />,
    );

    const toast = screen.getByRole('listitem');

    expect(toast.style.transform).not.toContain('scale');
  });
});
