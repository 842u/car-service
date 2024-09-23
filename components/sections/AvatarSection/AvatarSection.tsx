import { SyntheticEvent, useContext, useEffect, useRef, useState } from 'react';

import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Button } from '@/components/ui/Button/Button';
import { SettingsSection } from '@/components/ui/SettingsSection/SettingsSection';
import { SubmitButton } from '@/components/ui/SubmitButton/SubmitButton';
import { UserProfileContext } from '@/context/UserProfileContext';

export function AvatarSection() {
  const userProfile = useContext(UserProfileContext);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarInputElement = useRef<HTMLInputElement>();

  const avatarFileUrl = avatarFile && URL.createObjectURL(avatarFile);

  const avatarChangeHandler = (event: SyntheticEvent) => {
    const input = event.target;

    if (input instanceof HTMLInputElement) {
      const file = input.files?.[0];

      file && setAvatarFile(file);
    }
  };

  const cancelAvatarChangeHandler = () => {
    avatarInputElement.current!.value = '';
    avatarFileUrl && URL.revokeObjectURL(avatarFileUrl);
    setAvatarFile(null);
  };

  useEffect(() => {
    avatarInputElement.current = document.querySelector(
      '#avatar-upload',
    ) as HTMLInputElement;
  }, [avatarFile]);

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
              accept="image/png, image/jpeg"
              className="invisible"
              id="avatar-upload"
              type="file"
              onChange={avatarChangeHandler}
            />
          </label>
          <Avatar src={avatarFileUrl || userProfile?.avatar_url || ''} />
        </div>
        <div>
          <p className="text-sm">Click on the avatar to upload a custom one.</p>
          <p className="text-sm text-alpha-grey-700">
            Accepted PNG and JPG files. Max file size 5MB.
          </p>
          <div className="my-4 flex justify-center gap-4">
            <SubmitButton className="flex-1" disabled={!avatarFile}>
              Save
            </SubmitButton>
            <Button
              className="flex-1"
              disabled={!avatarFile}
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
