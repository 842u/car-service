import Image from 'next/image';

import { UserIcon } from '@/components/decorative/icons/UserIcon';

type AvatarImagePreviewProps = {
  src?: string | null;
  className?: string;
};

export function AvatarImagePreview({
  src,
  className,
}: AvatarImagePreviewProps) {
  return (
    <div className={className}>
      {src ? (
        <Image fill alt="car image" className="object-contain" src={src} />
      ) : (
        <UserIcon className="stroke-alpha-grey-600 stroke-1 object-contain" />
      )}
    </div>
  );
}
