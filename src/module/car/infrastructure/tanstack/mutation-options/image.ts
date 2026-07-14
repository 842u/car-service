import { mutationOptions } from '@tanstack/react-query';

import { carApiClient } from '@/car/dependency/api-client';
import { browserStorageClient } from '@/dependency/storage-client/browser';
import { hashFile } from '@/lib/utils';

type MutationVariables = {
  carId: string;
  image: File | undefined | null;
};

export const carImageChangeMutationOptions = () =>
  mutationOptions({
    throwOnError: false,
    mutationFn: async (variables: MutationVariables) => {
      const { carId, image } = variables;

      if (!image) throw new Error('No file was provided. Try again.');

      const hashedFile = await hashFile(image);

      const uploadPath = `${carId}/${hashedFile}`;

      const uploadResult = await browserStorageClient.upload(
        'cars_images',
        uploadPath,
        image,
      );

      if (!uploadResult.success) {
        const { message } = uploadResult.error;
        throw new Error(
          `The image failed to upload: ${message} Try again by editing car details.`,
        );
      }

      const carImagePath = uploadResult.data.fullPath;

      const apiUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL! + '/storage/v1/object/public/';

      const imageUrl = apiUrl + carImagePath;

      const imageChangeResult = await carApiClient.imageChange({
        carId,
        imageUrl,
      });

      if (!imageChangeResult.success) {
        const { message } = imageChangeResult.error;
        throw new Error(
          `The image could not be saved: ${message} Try again by editing car details.`,
        );
      }

      return imageChangeResult.data;
    },
  });
