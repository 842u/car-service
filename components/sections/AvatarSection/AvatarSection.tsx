import { useContext } from 'react';

import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Button } from '@/components/ui/Button/Button';
import { SettingsSection } from '@/components/ui/SettingsSection/SettingsSection';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { UserProfileContext } from '@/context/UserProfileContext';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';

export function AvatarSection() {
  const userProfile = useContext(UserProfileContext);
  const {
    avatarChangeHandler,
    avatarUploadHandler,
    cancelAvatarChangeHandler,
    avatarPreviewUrl,
    avatarInputElement,
    avatarOptimisticUrl,
    isLoading,
  } = useAvatarUpload();

  return (
    <SettingsSection headingText="Avatar">
      <div className="flex w-full flex-col items-center lg:flex-row lg:justify-around">
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
          <Avatar
            src={
              avatarPreviewUrl ||
              avatarOptimisticUrl ||
              userProfile?.avatar_url ||
              ''
            }
          />
        </div>
        <div>
          <p className="text-sm">Click on the avatar to upload a custom one.</p>
          <p className="text-sm text-alpha-grey-700">
            Accepted file types: PNG, JPG. Max file size: 5MB.
          </p>
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
