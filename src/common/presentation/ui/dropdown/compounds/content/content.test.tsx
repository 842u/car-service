import { render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { DropdownContent } from './content';
import { useDropdownContent } from './use-content';

jest.mock('./use-content', () => ({
  useDropdownContent: jest.fn(),
}));

const mockUseDropdownContent = useDropdownContent as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('DropdownContent', () => {
  it('should render nothing when isOpen is false', () => {
    mockUseDropdownContent.mockReturnValue({
      isOpen: false,
      position: { top: 0, left: 0 },
      contentRef: createRef(),
    });

    render(<DropdownContent>menu items</DropdownContent>);

    expect(screen.queryByText('menu items')).not.toBeInTheDocument();
  });

  it('should render children when isOpen is true', () => {
    mockUseDropdownContent.mockReturnValue({
      isOpen: true,
      position: { top: 0, left: 0 },
      contentRef: createRef(),
    });

    render(<DropdownContent>menu items</DropdownContent>);

    expect(screen.getByText('menu items')).toBeInTheDocument();
  });

  it('should apply top and left position style from useDropdownContent', () => {
    mockUseDropdownContent.mockReturnValue({
      isOpen: true,
      position: { top: 42, left: 99 },
      contentRef: createRef(),
    });

    render(<DropdownContent>menu items</DropdownContent>);

    expect(screen.getByText('menu items')).toHaveStyle({
      top: '42px',
      left: '99px',
    });
  });

  it('should render content into document.body via portal', () => {
    mockUseDropdownContent.mockReturnValue({
      isOpen: true,
      position: { top: 0, left: 0 },
      contentRef: createRef(),
    });

    const { container } = render(<DropdownContent>menu items</DropdownContent>);

    const menuEl = screen.getByText('menu items');
    expect(container).not.toContainElement(menuEl);
    expect(document.body).toContainElement(menuEl);
  });

  it('should forward collisionDetection, side and align to useDropdownContent', () => {
    mockUseDropdownContent.mockReturnValue({
      isOpen: false,
      position: { top: 0, left: 0 },
      contentRef: createRef(),
    });

    render(
      <DropdownContent align="end" collisionDetection={true} side="top">
        content
      </DropdownContent>,
    );

    expect(mockUseDropdownContent).toHaveBeenCalledWith({
      collisionDetection: true,
      side: 'top',
      align: 'end',
    });
  });
});
