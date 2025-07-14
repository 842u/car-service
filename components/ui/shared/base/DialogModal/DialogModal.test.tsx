import { render, screen } from '@testing-library/react';

import { DialogModal } from './DialogModal';

describe('DialogModal', () => {
  it('should render as dialog element', () => {
    render(<DialogModal />);

    const dialogElement = screen.getByRole('dialog', { hidden: true });

    expect(dialogElement).toBeInTheDocument();
  });

  it('should render provided heading text', () => {
    const headingText = 'test';
    render(<DialogModal />);

    const heading = screen.getByRole('heading', {
      name: headingText,
      hidden: true,
    });

    expect(heading).toBeInTheDocument();
  });

  it('should render close button', () => {
    render(<DialogModal />);

    const closeButton = screen.getByRole('button', {
      name: 'close',
      hidden: true,
    });

    expect(closeButton).toBeInTheDocument();
  });

  it('should render provided children', () => {
    const childrenHeadingText = 'children test';
    render(
      <DialogModal>
        <h3>{childrenHeadingText}</h3>
      </DialogModal>,
    );

    const childrenElement = screen.getByRole('heading', {
      name: childrenHeadingText,
      hidden: true,
    });

    expect(childrenElement).toBeInTheDocument();
  });
});
