import { SyntheticEvent, useContext, useEffect, useRef, useState } from 'react';
import { ZodError } from 'zod';

import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Button } from '@/components/ui/Button/Button';
import { SettingsSection } from '@/components/ui/SettingsSection/SettingsSection';
import { ToastsContext } from '@/context/ToastsContext';
import { UserProfileContext } from '@/context/UserProfileContext';
import { hashFile } from '@/utils/general';
import { getBrowserClient } from '@/utils/supabase';
import { avatarFileSchema } from '@/utils/validation';

export function AvatarSection() {
  const { addToast } = useContext(ToastsContext);
  const userProfile = useContext(UserProfileContext);

  const [avatarPreviewFile, setAvatarPreviewFile] = useState<File | null>(null);

  const avatarInputElement = useRef<HTMLInputElement>();

  const avatarPreviewUrl =
    avatarPreviewFile && URL.createObjectURL(avatarPreviewFile);

  const clearAvatarPreview = () => {
    avatarInputElement.current!.value = '';
    avatarPreviewUrl && URL.revokeObjectURL(avatarPreviewUrl);
    setAvatarPreviewFile(null);
  };

  const avatarChangeHandler = (event: SyntheticEvent) => {
    const input = event.target;

    if (input instanceof HTMLInputElement) {
      const file = input.files?.[0];

      if (file) {
        try {
          avatarFileSchema.parse(file);

          setAvatarPreviewFile(file);
        } catch (error) {
          clearAvatarPreview();

          if (error instanceof ZodError) {
            addToast(error.issues[0].message, 'error');
          } else if (error instanceof Error) {
            addToast(error.message, 'error');
          }
        }
      } else {
        clearAvatarPreview();

        addToast('You must select an file to upload.', 'error');
      }
    }
  };

  const cancelAvatarChangeHandler = () => {
    clearAvatarPreview();
  };

  const avatarUploadHandler = async () => {
    const supabase = getBrowserClient();

    if (avatarPreviewFile) {
      const hashedFile = await hashFile(avatarPreviewFile);
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`${userProfile?.id}/${hashedFile}`, avatarPreviewFile, {
          cacheControl: '3600',
          upsert: false,
        });

      data && addToast('Avatar uploaded successfully.', 'success');
      error && addToast(error.message, 'error');
      clearAvatarPreview();
    }
  };

  useEffect(() => {
    avatarInputElement.current = document.querySelector(
      '#avatar-upload',
    ) as HTMLInputElement;
  }, []);

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
          <Avatar src={avatarPreviewUrl || userProfile?.avatar_url || ''} />
        </div>
        <div>
          <p className="text-sm">Click on the avatar to upload a custom one.</p>
          <p className="text-sm text-alpha-grey-700">
            Accepted file types: PNG, JPG. Max file size: 5MB.
          </p>
          <div className="my-4 flex justify-center gap-4">
            <Button
              className="flex-1 border-accent-500 bg-accent-800 text-light-500 transition-colors disabled:border-accent-700 disabled:bg-accent-900 disabled:text-light-800"
              disabled={!avatarPreviewFile}
              onClick={avatarUploadHandler}
            >
              Save
            </Button>
            <Button
              className="flex-1"
              disabled={!avatarPreviewFile}
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
