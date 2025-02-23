import { SyntheticEvent, useContext, useEffect, useRef, useState } from 'react';
import { ZodError } from 'zod';

import { ToastsContext } from '@/context/ToastsContext';
import { UserProfileContext } from '@/context/UserProfileContext';
import { fetchUserProfile, hashFile } from '@/utils/general';
import { createClient } from '@/utils/supabase/client';
import { imageFileSchema } from '@/utils/validation';

export function useAvatarUpload() {
  const { addToast } = useContext(ToastsContext);
  const { userProfile, setUserProfile } = useContext(UserProfileContext);

  const [avatarPreviewFile, setAvatarPreviewFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const avatarInputElement = useRef<HTMLInputElement>(null);
  const avatarPreviewUrl = useRef('');
  const avatarOptimisticUrl = useRef('');

  const clearAvatarOptimistic = () => {
    URL.revokeObjectURL(userProfile.avatar_url || '');
    URL.revokeObjectURL(avatarOptimisticUrl.current);
    avatarOptimisticUrl.current = '';
  };

  const clearAvatarPreview = () => {
    if (avatarInputElement.current) {
      avatarInputElement.current.value = '';
    }

    URL.revokeObjectURL(avatarPreviewUrl.current);
    avatarPreviewUrl.current = '';

    setAvatarPreviewFile(null);
  };

  const avatarChangeHandler = (event: SyntheticEvent) => {
    URL.revokeObjectURL(avatarPreviewUrl.current);

    const input = event.target;

    if (input instanceof HTMLInputElement) {
      const file = input.files?.[0];

      if (file) {
        try {
          imageFileSchema.parse(file);
          avatarPreviewUrl.current = URL.createObjectURL(file);

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
    setIsLoading(true);
    clearAvatarOptimistic();

    const supabase = createClient();

    if (avatarPreviewFile) {
      avatarOptimisticUrl.current = URL.createObjectURL(avatarPreviewFile);

      setUserProfile((previousState) => ({
        ...previousState,
        avatar_url: avatarOptimisticUrl.current,
      }));

      const hashedFile = await hashFile(avatarPreviewFile);

      const { data, error: fileUploadError } = await supabase.storage
        .from('avatars')
        .upload(`${userProfile?.id}/${hashedFile}`, avatarPreviewFile);

      try {
        if (data) {
          const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update({
              avatar_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`,
            })
            .eq('id', userProfile?.id || '');

          if (profileUpdateError) {
            throw new Error('Failed to update user profile.');
          }

          setIsLoading(false);
          clearAvatarPreview();

          addToast('Avatar uploaded successfully.', 'success');
        } else if (fileUploadError) {
          throw new Error(fileUploadError.message);
        }
      } catch (error) {
        const profileData = await fetchUserProfile();
        setUserProfile((previousState) => ({
          ...previousState,
          ...profileData,
        }));

        setIsLoading(false);
        clearAvatarPreview();
        clearAvatarOptimistic();

        if (error instanceof Error) {
          addToast(error.message, 'error');
        }
      }
    }
  };

  useEffect(
    () => () => {
      clearAvatarPreview();
    },
    [],
  );

  return {
    avatarChangeHandler,
    avatarInputElement,
    cancelAvatarChangeHandler,
    avatarUploadHandler,
    isLoading,
    avatarPreviewUrl: avatarPreviewUrl.current,
  };
}
