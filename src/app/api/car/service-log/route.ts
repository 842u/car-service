import type { NextRequest } from 'next/server';

import {
  addServiceLogApiHandler,
  editServiceLogApiHandler,
} from '@/car/service-log/dependency/api-handler';
import {
  createAddServiceLogUseCase,
  createEditServiceLogUseCase,
} from '@/car/service-log/dependency/use-case';
import { addServiceLogApiRequestSchema } from '@/car/service-log/interface/api/add.schema';
import { editServiceLogApiRequestSchema } from '@/car/service-log/interface/api/edit.schema';
import { httpErrorMapper } from '@/common/infrastructure/api-handler/http-error-mapper';

export const maxDuration = 10;

export async function POST(request: NextRequest) {
  const preprocessRequestResult =
    await addServiceLogApiHandler.preprocessRequest(
      request,
      addServiceLogApiRequestSchema,
    );

  if (!preprocessRequestResult.success) {
    const { message, issues } = preprocessRequestResult.error;
    const { status } = preprocessRequestResult;
    return addServiceLogApiHandler.errorResponse({ message, issues }, status);
  }

  const addServiceLogUseCase = await createAddServiceLogUseCase();

  const contract = preprocessRequestResult.data;

  const useCaseResult = await addServiceLogUseCase.execute(contract);

  if (!useCaseResult.success) {
    const { error, status } = httpErrorMapper.toApiError(useCaseResult.error);
    return addServiceLogApiHandler.errorResponse(error, status);
  }

  const serviceLogDto = useCaseResult.data;

  return addServiceLogApiHandler.successResponse(serviceLogDto, 201);
}

export async function PATCH(request: NextRequest) {
  const preprocessRequestResult =
    await editServiceLogApiHandler.preprocessRequest(
      request,
      editServiceLogApiRequestSchema,
    );

  if (!preprocessRequestResult.success) {
    const { message, issues } = preprocessRequestResult.error;
    const { status } = preprocessRequestResult;
    return editServiceLogApiHandler.errorResponse({ message, issues }, status);
  }

  const editServiceLogUseCase = await createEditServiceLogUseCase();

  const contract = preprocessRequestResult.data;

  const useCaseResult = await editServiceLogUseCase.execute(contract);

  if (!useCaseResult.success) {
    const { error, status } = httpErrorMapper.toApiError(useCaseResult.error);
    return editServiceLogApiHandler.errorResponse(error, status);
  }

  const serviceLogDto = useCaseResult.data;

  return editServiceLogApiHandler.successResponse(serviceLogDto, 200);
}
