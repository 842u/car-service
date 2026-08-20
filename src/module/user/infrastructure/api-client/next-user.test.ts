import type { ApiRequester } from '@/common/application/api-requester';
import { createMockApiRequester } from '@/common/application/api-requester.mock';
import { Result } from '@/common/application/result';
import { buildUserDto } from '@/user/application/dto/user.builder';
import { editUserApiResponseSchema } from '@/user/interface/api/edit.schema';
import { passwordChangeApiResponseSchema } from '@/user/interface/api/password-change.schema';
import { signInApiResponseSchema } from '@/user/interface/api/sign-in.schema';
import { signUpApiResponseSchema } from '@/user/interface/api/sign-up.schema';

import { NextUserApiClient } from './next-user';

describe('NextUserApiClient', () => {
  let mockApiRequester: jest.Mocked<ApiRequester>;
  let userApiClient: NextUserApiClient;

  beforeEach(() => {
    mockApiRequester = createMockApiRequester();
    userApiClient = new NextUserApiClient(mockApiRequester);
  });

  it('should send signUp as a POST to the sign-up endpoint', async () => {
    const contract = { email: 'test@example.com', password: 'Password1!' };

    await userApiClient.signUp(contract);

    expect(mockApiRequester.send).toHaveBeenCalledWith(
      'POST',
      '/api/auth/sign-up',
      contract,
      signUpApiResponseSchema,
    );
  });

  it('should send signIn as a POST to the sign-in endpoint', async () => {
    const contract = { email: 'test@example.com', password: 'Password1!' };

    await userApiClient.signIn(contract);

    expect(mockApiRequester.send).toHaveBeenCalledWith(
      'POST',
      '/api/auth/sign-in',
      contract,
      signInApiResponseSchema,
    );
  });

  it('should send passwordChange as a PATCH to the password-change endpoint', async () => {
    const contract = {
      password: 'newPassword123',
      passwordConfirm: 'newPassword123',
    };

    await userApiClient.passwordChange(contract);

    expect(mockApiRequester.send).toHaveBeenCalledWith(
      'PATCH',
      '/api/auth/password-change',
      contract,
      passwordChangeApiResponseSchema,
    );
  });

  it('should send edit as a PATCH to the user endpoint', async () => {
    const contract = { name: 'New Name' };

    await userApiClient.edit(contract);

    expect(mockApiRequester.send).toHaveBeenCalledWith(
      'PATCH',
      '/api/user',
      contract,
      editUserApiResponseSchema,
    );
  });

  it('should return the requester result unchanged', async () => {
    const userDto = buildUserDto();

    mockApiRequester.send.mockResolvedValue(Result.ok(userDto));

    const result = await userApiClient.edit({ name: userDto.name });

    expect(result).toEqual(Result.ok(userDto));
  });
});
