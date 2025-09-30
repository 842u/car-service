import { dependencyContainer, dependencyTokens } from '@/di';
import type { Profile } from '@/types';
import { hashFile } from '@/utils/general';

type PatchProfileParameters =
  | {
      property: Extract<keyof Profile, 'avatar_url'>;
      value: File | null | undefined;
    }
  | { property: Extract<keyof Profile, 'username'>; value: string | null };

export async function updateCurrentSessionProfile({
  property,
  value,
}: PatchProfileParameters) {
  const authClient = await dependencyContainer.resolve(
    dependencyTokens.AUTH_BROWSER_CLIENT,
  );

  const sessionResult = await authClient.getSession();

  if (!sessionResult.success) {
    const { message } = sessionResult.error;
    throw new Error(message);
  }

  const { user } = sessionResult.data;

  if (property === 'avatar_url') {
    if (!value) throw new Error('No file was provided. Try again.');

    const storageClient = await dependencyContainer.resolve(
      dependencyTokens.STORAGE_BROWSER_CLIENT,
    );

    const hashedFile = await hashFile(value);

    const uploadPath = `${user.id}/${hashedFile}`;

    const uploadResult = await storageClient.upload(
      'avatars',
      uploadPath,
      value,
    );

    if (!uploadResult.success) {
      const { message } = uploadResult.error;
      throw new Error(message);
    }

    return uploadResult.data;
  } else {
    const dbClient = await dependencyContainer.resolve(
      dependencyTokens.DATABASE_BROWSER_CLIENT,
    );

    const queryResult = await dbClient.query(async (from) =>
      from('profiles')
        .update({ [property]: value })
        .eq('id', user.id)
        .select(),
    );

    if (!queryResult.success) {
      const { message } = queryResult.error;
      throw new Error(message);
    }

    return queryResult.data;
  }
}
