import {
  IMAGE_FILE_ACCEPTED_MIME_TYPES,
  IMAGE_FILE_MAX_SIZE_BYTES,
} from '@/schemas/zod/common';
import { getMimeTypeExtensions } from '@/utils/general';

import { DashboardSection } from '../../../../features/dashboard/ui/DashboardSection/DashboardSection';
import { AvatarForm } from '../../forms/AvatarForm/AvatarForm';

const acceptedFileTypes = getMimeTypeExtensions(IMAGE_FILE_ACCEPTED_MIME_TYPES);
const maxFileSize = IMAGE_FILE_MAX_SIZE_BYTES / (1024 * 1024);

type AvatarSectionProps = {
  avatarUrl?: string | null;
};

export function AvatarSection({ avatarUrl }: AvatarSectionProps) {
  return (
    <DashboardSection>
      <DashboardSection.Heading headingLevel="h2">
        Avatar
      </DashboardSection.Heading>
      <DashboardSection.Text>
        Click on the image to upload a custom one.
      </DashboardSection.Text>
      <DashboardSection.Subtext className="my-4">
        {`Accepted file types: ${acceptedFileTypes}. Max file size: ${maxFileSize} MB.`}
      </DashboardSection.Subtext>
      <AvatarForm avatarUrl={avatarUrl} />
    </DashboardSection>
  );
}
