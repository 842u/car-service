import { render, screen } from '@testing-library/react';

import { IdSection } from './IdSection';

describe('IdSection', () => {
  it('should render a heading', () => {
    render(<IdSection />);

    const heading = screen.getByRole('heading', { name: 'ID' });

    expect(heading).toBeInTheDocument();
  });

  it('should render section info', () => {
    render(<IdSection />);

    const sectionInfo = screen.getByText(
      'This ID uniquely identifies your profile.',
    );

    expect(sectionInfo).toBeInTheDocument();
  });

  it('should render usage info', () => {
    render(<IdSection />);

    const usageInfo = screen.getByText(
      'You can share it with another users to manage cars ownerships. Click on it to automatically copy it to your clipboard.',
    );

    expect(usageInfo).toBeInTheDocument();
  });

  it('should render ID input', () => {
    render(<IdSection />);

    const IDInput = screen.getByRole('textbox', { name: 'current user ID' });

    expect(IDInput).toBeInTheDocument();
  });
});
