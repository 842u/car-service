import {
  IMAGE_FILE_ACCEPTED_MIME_TYPES,
  MAX_IMAGE_FILE_SIZE_BYTES,
} from '@/common/interface/schema/image-file.schema';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { AvatarForm } from '@/user/presentation/ui/forms/avatar/avatar';
import { getMimeTypeExtensions } from '@/utils/general';

const acceptedFileTypes = getMimeTypeExtensions(IMAGE_FILE_ACCEPTED_MIME_TYPES);
const maxFileSize = MAX_IMAGE_FILE_SIZE_BYTES / (1024 * 1024);

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
