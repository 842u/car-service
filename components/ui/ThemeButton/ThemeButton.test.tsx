import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'next-themes';

import { ThemeButton } from './ThemeButton';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('ThemeButton', () => {
  it('should render a button', () => {
    render(<ThemeButton />);

    const button = screen.getByRole('button', { name: 'switch color theme' });

    expect(button).toBeInTheDocument();
  });

  it('should render light theme icon if current theme is dark', () => {
    const currentTheme = 'dark';

    render(
      <ThemeProvider defaultTheme={currentTheme} enableSystem={false}>
        <ThemeButton />
      </ThemeProvider>,
    );

    const lightThemeIcon = screen.getByTestId('light-theme-icon');

    expect(lightThemeIcon).toBeInTheDocument();
  });

  it('should render dark theme icon if current theme is light', () => {
    const currentTheme = 'light';

    render(
      <ThemeProvider defaultTheme={currentTheme} enableSystem={false}>
        <ThemeButton />
      </ThemeProvider>,
    );

    const darkThemeIcon = screen.getByTestId('dark-theme-icon');

    expect(darkThemeIcon).toBeInTheDocument();
  });

  it('should switch color theme icons on click', async () => {
    const currentTheme = 'light';
    const user = userEvent.setup();

    render(
      <ThemeProvider defaultTheme={currentTheme} enableSystem={false}>
        <ThemeButton />
      </ThemeProvider>,
    );

    const button = screen.getByRole('button', { name: 'switch color theme' });
    let darkThemeIcon = screen.queryByTestId('dark-theme-icon');
    let lightThemeIcon = screen.queryByTestId('light-theme-icon');

    expect(darkThemeIcon).toBeInTheDocument();
    expect(lightThemeIcon).not.toBeInTheDocument();

    await user.click(button);
    darkThemeIcon = screen.queryByTestId('dark-theme-icon');
    lightThemeIcon = screen.queryByTestId('light-theme-icon');

    expect(darkThemeIcon).not.toBeInTheDocument();
    expect(lightThemeIcon).toBeInTheDocument();

    await user.click(button);
    darkThemeIcon = screen.queryByTestId('dark-theme-icon');
    lightThemeIcon = screen.queryByTestId('light-theme-icon');

    expect(darkThemeIcon).toBeInTheDocument();
    expect(lightThemeIcon).not.toBeInTheDocument();
  });
});
