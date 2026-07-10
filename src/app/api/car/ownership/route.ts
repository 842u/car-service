import type { NextRequest } from 'next/server';

import { addOwnerApiHandler } from '@/car/ownership/dependency/api-handler';
import { createAddOwnerUseCase } from '@/car/ownership/dependency/use-case';
import { addOwnerApiRequestSchema } from '@/car/ownership/interface/api/add.schema';
import { httpErrorMapper } from '@/common/infrastructure/api-handler/http-error-mapper';

export const maxDuration = 10;

export async function POST(request: NextRequest) {
  const preprocessRequestResult = await addOwnerApiHandler.preprocessRequest(
    request,
    addOwnerApiRequestSchema,
  );

  if (!preprocessRequestResult.success) {
    const { message, issues } = preprocessRequestResult.error;
    const { status } = preprocessRequestResult;
    return addOwnerApiHandler.errorResponse({ message, issues }, status);
  }

  const addOwnerUseCase = await createAddOwnerUseCase();

  const contract = preprocessRequestResult.data;

  const useCaseResult = await addOwnerUseCase.execute(contract);

  if (!useCaseResult.success) {
    const { error, status } = httpErrorMapper.toApiError(useCaseResult.error);
    return addOwnerApiHandler.errorResponse(error, status);
  }

  const ownershipDtos = useCaseResult.data;

  return addOwnerApiHandler.successResponse(ownershipDtos, 201);
}
