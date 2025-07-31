import { render, screen } from '@testing-library/react';

import { ToastType } from '@/types';

import { ToasterToast } from './toast';

jest.setTimeout(10000);

describe('ToasterToast', () => {
  it('should render a button to close the toast', () => {
    render(<ToasterToast id="id" message="Toast" type="error" />);

    const closeButton = screen.getByRole('button', { name: /close/i });

    expect(closeButton).toBeInTheDocument();
  });

  it('should render provided message', () => {
    const toastMessage = 'test';
    const regexp = new RegExp(toastMessage, 'i');
    render(<ToasterToast id="id" message={toastMessage} type="error" />);

    const toast = screen.getByRole('listitem', { name: regexp });

    expect(toast).toBeInTheDocument();
  });

  it('should render the toast of proper type', () => {
    const toastTypes: ToastType[] = ['error', 'info', 'success', 'warning'];
    toastTypes.forEach((type) => {
      const regexp = new RegExp(`${type} notification:`, 'i');
      render(<ToasterToast id="id" message="Toast" type={type} />);

      const toast = screen.getByRole('listitem', { name: regexp });

      expect(toast).toBeInTheDocument();
    });
  });
});
