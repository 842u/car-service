import { render, screen } from '@testing-library/react';
import { Route } from 'next';

import { Car } from '@/types';

import { CarCard } from './card';

const MOCK_CAR_ID = 'cedd91fa-23a4-4098-9936-353b419db9f7';
const MOCK_CAR_DATA: Car = {
  id: MOCK_CAR_ID,
  custom_name: 'Name',
  brand: 'Brand',
  model: 'Model',
  license_plates: 'ABC123',
  image_url: 'http://some.url',
  additional_fuel_type: null,
  created_at: null,
  created_by: null,
  drive_type: null,
  engine_capacity: null,
  fuel_type: null,
  insurance_expiration: null,
  mileage: null,
  production_year: null,
  technical_inspection_expiration: null,
  transmission_type: null,
  vin: null,
};

describe('CarCard', () => {
  it('should render as a link element', async () => {
    render(<CarCard car={MOCK_CAR_DATA} />);

    const linkElement = await screen.findByRole('link', {
      name: new RegExp(`${MOCK_CAR_DATA.custom_name}`, 'i'),
    });

    expect(linkElement).toBeInTheDocument();
  });

  it('should have a proper href attribute', async () => {
    const carRouteStaticSegment = '/dashboard/cars' satisfies Route;
    const properHref = `${carRouteStaticSegment}/${MOCK_CAR_ID}`;
    render(<CarCard car={MOCK_CAR_DATA} />);

    const linkElement = await screen.findByRole('link', {
      name: new RegExp(`${MOCK_CAR_DATA.custom_name}`, 'i'),
    });

    expect(linkElement).toHaveAttribute('href', properHref);
  });

  it('should render a car image', async () => {
    render(<CarCard car={MOCK_CAR_DATA} />);

    const carImage = await screen.findByRole('img', { name: 'car image' });

    expect(carImage).toBeInTheDocument();
  });

  it('should render car basic info', async () => {
    render(<CarCard car={MOCK_CAR_DATA} />);

    const carName = await screen.findByText(MOCK_CAR_DATA.custom_name);
    const carBrand = await screen.findByText(
      MOCK_CAR_DATA.brand || 'brandNotFound',
    );
    const carModel = await screen.findByText(
      MOCK_CAR_DATA.model || 'modelNotFound',
    );
    const carLicensePlates = await screen.findByText(
      MOCK_CAR_DATA.license_plates || 'licensePlatesNotFound',
    );

    expect(carName).toBeInTheDocument();
    expect(carBrand).toBeInTheDocument();
    expect(carModel).toBeInTheDocument();
    expect(carLicensePlates).toBeInTheDocument();
  });
});
