import type { NextRequest } from 'next/server';

import { carImageChangeApiHandler } from '@/car/dependency/api-handler';
import { createCarImageChangeUseCase } from '@/car/dependency/use-case';
import { carImageChangeApiRequestSchema } from '@/car/interface/api/image-change.schema';
import { httpErrorMapper } from '@/common/infrastructure/api-handler/http-error-mapper';

export const maxDuration = 10;

export async function PATCH(request: NextRequest) {
  const preprocessResult = await carImageChangeApiHandler.preprocessRequest(
    request,
    carImageChangeApiRequestSchema,
  );

  if (!preprocessResult.success) {
    const { message, issues } = preprocessResult.error;
    const { status } = preprocessResult;
    return carImageChangeApiHandler.errorResponse({ message, issues }, status);
  }

  const carImageChangeUseCase = await createCarImageChangeUseCase();

  const contract = preprocessResult.data;

  const useCaseResult = await carImageChangeUseCase.execute(contract);

  if (!useCaseResult.success) {
    const { error, status } = httpErrorMapper.toApiError(useCaseResult.error);
    return carImageChangeApiHandler.errorResponse(error, status);
  }

  const carDto = useCaseResult.data;

  return carImageChangeApiHandler.successResponse(carDto, 200);
}
