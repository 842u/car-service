import { Route } from 'next';

import {
  ServiceLogPostRouteHandlerRequest,
  ServiceLogRouteHandlerResponse,
} from '@/app/api/service-log/route';
import { CarServiceLogFormValues } from '@/schemas/zod/carServiceLogFormSchema';
import { RouteHandlerResponse } from '@/types';

import { FormProps } from '../../shared/base/Form/Form';
import { CarServiceLogForm } from '../../shared/CarServiceLogForm/CarServiceLogForm';

type CarServiceLogAddFormProps = Omit<FormProps, 'onSubmit'> & {
  carId: string;
  onSubmit?: () => void;
};

export function CarServiceLogAddForm({
  carId,
  onSubmit,
  ...props
}: CarServiceLogAddFormProps) {
  const handleFormSubmit = async (formData: CarServiceLogFormValues) => {
    const jsonRequestData = JSON.stringify({
      formData,
      car_id: carId,
    } satisfies ServiceLogPostRouteHandlerRequest);

    const url = new URL(window.location.origin);
    url.pathname = '/api/service-log' satisfies Route;

    try {
      const apiResponse = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: jsonRequestData,
      });

      const { error } =
        (await apiResponse.json()) as RouteHandlerResponse<ServiceLogRouteHandlerResponse>;

      if (!apiResponse.ok || error) {
        throw new Error(
          error?.message || `Request failed with status ${apiResponse.status}.`,
        );
      }
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('Unknown error occurred.');
    }

    onSubmit && onSubmit();
  };

  return <CarServiceLogForm onSubmit={handleFormSubmit} {...props} />;
}
