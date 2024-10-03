import { SyntheticEvent, useContext, useEffect, useRef, useState } from 'react';
import { ZodError } from 'zod';

import { ToastsContext } from '@/context/ToastsContext';
import { UserProfileContext } from '@/context/UserProfileContext';
import { hashFile } from '@/utils/general';
import { getBrowserClient } from '@/utils/supabase';
import { avatarFileSchema } from '@/utils/validation';

export function useAvatarUpload() {
  const { addToast } = useContext(ToastsContext);
  const userProfile = useContext(UserProfileContext);

  const [avatarPreviewFile, setAvatarPreviewFile] = useState<File | null>(null);

  const avatarInputElement = useRef<HTMLInputElement>(null);
  const avatarPreviewUrl = useRef('');
  const avatarOptimisticUrl = useRef('');

  avatarPreviewUrl.current =
    (avatarPreviewFile && URL.createObjectURL(avatarPreviewFile)) || '';

  const clearAvatarPreview = () => {
    if (avatarInputElement.current) {
      avatarInputElement.current.value = '';
    }
    avatarPreviewUrl && URL.revokeObjectURL(avatarPreviewUrl.current);
    setAvatarPreviewFile(null);
  };

  const avatarChangeHandler = (event: SyntheticEvent) => {
    const input = event.target;

    if (avatarPreviewUrl.current) {
      URL.revokeObjectURL(avatarPreviewUrl.current);
    }

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

    if (avatarOptimisticUrl.current) {
      URL.revokeObjectURL(avatarOptimisticUrl.current);
    }

    avatarOptimisticUrl.current =
      (avatarPreviewFile && URL.createObjectURL(avatarPreviewFile)) || '';

    if (avatarPreviewFile) {
      const hashedFile = await hashFile(avatarPreviewFile);
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(`${userProfile?.id}/${hashedFile}`, avatarPreviewFile);

      try {
        if (data) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              avatar_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`,
            })
            .eq('id', userProfile?.id || '');

          if (updateError) {
            throw new Error('Failed to update user profile.');
          }

          clearAvatarPreview();
          addToast('Avatar uploaded successfully.', 'success');
        } else if (uploadError) {
          throw new Error(uploadError.message);
        }
      } catch (error) {
        clearAvatarPreview();
        if (error instanceof Error) {
          addToast(error.message, 'error');
        }
      }
    }
  };

  useEffect(
    () => () => {
      if (avatarPreviewUrl.current) {
        URL.revokeObjectURL(avatarPreviewUrl.current);
      }
      if (avatarOptimisticUrl.current) {
        URL.revokeObjectURL(avatarOptimisticUrl.current);
      }
    },
    [],
  );

  return {
    avatarChangeHandler,
    avatarInputElement,
    cancelAvatarChangeHandler,
    avatarUploadHandler,
    avatarPreviewUrl: avatarPreviewUrl.current,
    avatarOptimisticUrl: avatarOptimisticUrl.current,
  };
}
