import { SyntheticEvent, useContext, useEffect, useRef, useState } from 'react';
import { ZodError } from 'zod';

import { ToastsContext } from '@/context/ToastsContext';
import { UserProfileContext } from '@/context/UserProfileContext';
import { hashFile } from '@/utils/general';
import { getBrowserClient } from '@/utils/supabase';
import { avatarFileSchema } from '@/utils/validation';

export function useAvatarUpload(avatarInputSelector: string) {
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
      avatarInputSelector,
    ) as HTMLInputElement;
  }, [avatarInputSelector]);

  return {
    avatarChangeHandler,
    cancelAvatarChangeHandler,
    avatarUploadHandler,
    avatarPreviewUrl,
  };
}
