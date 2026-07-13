import type { NextRequest } from 'next/server';

import {
  addOwnerApiHandler,
  promotePrimaryOwnerApiHandler,
  removeOwnerApiHandler,
} from '@/car/ownership/dependency/api-handler';
import {
  createAddOwnerUseCase,
  createPromotePrimaryOwnerUseCase,
  createRemoveOwnerUseCase,
} from '@/car/ownership/dependency/use-case';
import { addOwnerApiRequestSchema } from '@/car/ownership/interface/api/add.schema';
import { promotePrimaryOwnerApiRequestSchema } from '@/car/ownership/interface/api/promote.schema';
import { removeOwnerApiRequestSchema } from '@/car/ownership/interface/api/remove.schema';
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

export async function DELETE(request: NextRequest) {
  const preprocessRequestResult = await removeOwnerApiHandler.preprocessRequest(
    request,
    removeOwnerApiRequestSchema,
  );

  if (!preprocessRequestResult.success) {
    const { message, issues } = preprocessRequestResult.error;
    const { status } = preprocessRequestResult;
    return removeOwnerApiHandler.errorResponse({ message, issues }, status);
  }

  const removeOwnerUseCase = await createRemoveOwnerUseCase();

  const contract = preprocessRequestResult.data;

  const useCaseResult = await removeOwnerUseCase.execute(contract);

  if (!useCaseResult.success) {
    const { error, status } = httpErrorMapper.toApiError(useCaseResult.error);
    return removeOwnerApiHandler.errorResponse(error, status);
  }

  return removeOwnerApiHandler.successResponse(null, 200);
}

export async function PATCH(request: NextRequest) {
  const preprocessRequestResult =
    await promotePrimaryOwnerApiHandler.preprocessRequest(
      request,
      promotePrimaryOwnerApiRequestSchema,
    );

  if (!preprocessRequestResult.success) {
    const { message, issues } = preprocessRequestResult.error;
    const { status } = preprocessRequestResult;
    return promotePrimaryOwnerApiHandler.errorResponse(
      { message, issues },
      status,
    );
  }

  const promotePrimaryOwnerUseCase = await createPromotePrimaryOwnerUseCase();

  const contract = preprocessRequestResult.data;

  const useCaseResult = await promotePrimaryOwnerUseCase.execute(contract);

  if (!useCaseResult.success) {
    const { error, status } = httpErrorMapper.toApiError(useCaseResult.error);
    return promotePrimaryOwnerApiHandler.errorResponse(error, status);
  }

  const ownershipDtos = useCaseResult.data;

  return promotePrimaryOwnerApiHandler.successResponse(ownershipDtos, 200);
}
