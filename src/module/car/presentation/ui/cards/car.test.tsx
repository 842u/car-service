import { render, screen } from '@testing-library/react';
import type { Route } from 'next';

import { createMockCarDto } from '@/lib/jest/mock/src/module/car/application/dto/car';

import { CarCard } from './car';

describe('CarCard', () => {
  const mockCar = createMockCarDto();

  it('should render as a link element', async () => {
    render(<CarCard car={mockCar} />);

    const linkElement = await screen.findByRole('link', {
      name: new RegExp(`${mockCar.customName}`, 'i'),
    });

    expect(linkElement).toBeInTheDocument();
  });

  it('should have a proper href attribute', async () => {
    const carRouteStaticSegment = '/dashboard/cars' satisfies Route;
    const properHref = `${carRouteStaticSegment}/${mockCar.id}`;
    render(<CarCard car={mockCar} />);

    const linkElement = await screen.findByRole('link', {
      name: new RegExp(`${mockCar.customName}`, 'i'),
    });

    expect(linkElement).toHaveAttribute('href', properHref);
  });

  it('should render a car image', async () => {
    render(<CarCard car={mockCar} />);

    const carImage = await screen.findByRole('img', { name: 'car image' });

    expect(carImage).toBeInTheDocument();
  });

  it('should render car basic info', async () => {
    render(<CarCard car={mockCar} />);

    const carName = await screen.findByText(mockCar.customName);
    const carBrand = await screen.findByText(mockCar.brand || 'brandNotFound');
    const carModel = await screen.findByText(mockCar.model || 'modelNotFound');
    const carLicensePlates = await screen.findByText(
      mockCar.licensePlates || 'licensePlatesNotFound',
    );

    expect(carName).toBeInTheDocument();
    expect(carBrand).toBeInTheDocument();
    expect(carModel).toBeInTheDocument();
    expect(carLicensePlates).toBeInTheDocument();
  });
});
