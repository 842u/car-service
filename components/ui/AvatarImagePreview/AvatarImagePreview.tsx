import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

import { UserIcon } from '@/components/decorative/icons/UserIcon';
import { ImageWithPreviewProps } from '@/types';
import { getProfile } from '@/utils/supabase/general';

import { Spinner } from '../Spinner/Spinner';

export function AvatarImagePreview({
  previewUrl,
  className,
}: ImageWithPreviewProps) {
  const { data, isSuccess, isPending, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const displayPreview = !isPending && previewUrl;
  const displayProfile = !previewUrl && isSuccess;
  const displayDefault = isError && !previewUrl;

  return (
    <div
      className={twMerge(
        'flex h-full w-full items-center justify-center p-20 md:p-10',
        className,
      )}
    >
      {isPending && (
        <Spinner className="stroke-accent-400 fill-accent-400 h-auto" />
      )}

      {displayPreview && (
        <Image
          fill
          alt="avatar image"
          className="object-contain"
          src={previewUrl}
        />
      )}
      {displayProfile && data?.avatar_url && (
        <Image
          fill
          alt="avatar image"
          className="object-contain"
          src={data.avatar_url}
        />
      )}
      {displayDefault && (
        <UserIcon className="stroke-alpha-grey-600 stroke-1 object-contain" />
      )}
    </div>
  );
}
