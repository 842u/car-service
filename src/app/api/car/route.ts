import type { NextRequest } from 'next/server';

import { addCarApiHandler } from '@/car/dependency/api-handler';
import { createAddCarUseCase } from '@/car/dependency/use-case';
import { addCarApiRequestSchema } from '@/car/interface/api/add.schema';
import { httpErrorMapper } from '@/common/infrastructure/api-handler/http-error-mapper';

export const maxDuration = 10;

export async function POST(request: NextRequest) {
  const preprocessRequestResult = await addCarApiHandler.preprocessRequest(
    request,
    addCarApiRequestSchema,
  );

  if (!preprocessRequestResult.success) {
    const { message, issues } = preprocessRequestResult.error;
    const { status } = preprocessRequestResult;
    return addCarApiHandler.errorResponse({ message, issues }, status);
  }

  const addCarUseCase = await createAddCarUseCase();

  const contract = preprocessRequestResult.data;

  const useCaseResult = await addCarUseCase.execute(contract);

  if (!useCaseResult.success) {
    const { error, status } = httpErrorMapper.toApiError(useCaseResult.error);
    return addCarApiHandler.errorResponse(error, status);
  }

  const carDto = useCaseResult.data;

  return addCarApiHandler.successResponse(carDto, 201);
}
