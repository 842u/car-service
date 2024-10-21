import { useContext } from 'react';

import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Button } from '@/components/ui/Button/Button';
import { SettingsSection } from '@/components/ui/SettingsSection/SettingsSection';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { UserProfileContext } from '@/context/UserProfileContext';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import {
  ACCEPTED_AVATAR_FILE_TYPES,
  MAX_AVATAR_FILE_SIZE,
} from '@/utils/validation';

const acceptedFileTypes = ACCEPTED_AVATAR_FILE_TYPES.map(
  (mimeType) => mimeType.split('/')[1],
)
  .join(', ')
  .toUpperCase();

const maxFileSize = MAX_AVATAR_FILE_SIZE / (1024 * 1024);

export function AvatarSection() {
  const { userProfile } = useContext(UserProfileContext);
  const {
    avatarChangeHandler,
    avatarUploadHandler,
    cancelAvatarChangeHandler,
    avatarPreviewUrl,
    avatarInputElement,
    isLoading,
  } = useAvatarUpload();

  return (
    <SettingsSection headingText="Avatar">
      <div className="flex w-full flex-col items-center lg:flex-row lg:justify-between">
        <div className="flex w-1/3 flex-col items-center justify-center">
          <div className="relative h-24 w-24">
            <label
              aria-label="upload avatar"
              className="absolute z-10 inline-block h-full w-full cursor-pointer rounded-full"
              htmlFor="avatar-upload"
            >
              <input
                ref={avatarInputElement}
                accept="image/png, image/jpeg"
                className="invisible"
                id="avatar-upload"
                type="file"
                onChange={avatarChangeHandler}
              />
            </label>
            <Avatar src={avatarPreviewUrl || userProfile?.avatar_url || ''} />
          </div>
        </div>
        <div className="w-full flex-1">
          <div className="my-4 text-sm">
            <p>Click on the avatar to upload a custom one.</p>
            <p className="text-alpha-grey-700">
              {`Accepted file types: ${acceptedFileTypes}. Max file size:
            ${maxFileSize}MB.`}
            </p>
          </div>
          <div className="my-4 flex justify-center gap-4">
            <Button
              className="flex-1 border-accent-500 bg-accent-800 text-light-500 transition-colors disabled:border-accent-700 disabled:bg-accent-900 disabled:text-light-800"
              disabled={!avatarPreviewUrl || isLoading}
              onClick={avatarUploadHandler}
            >
              {isLoading ? (
                <Spinner className="m-auto h-full" color="#88868c" />
              ) : (
                'Save'
              )}
            </Button>
            <Button
              className="flex-1"
              disabled={!avatarPreviewUrl || isLoading}
              onClick={cancelAvatarChangeHandler}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}
