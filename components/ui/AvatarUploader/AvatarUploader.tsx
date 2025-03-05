import { useContext } from 'react';

import { UserProfileContext } from '@/context/UserProfileContext';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { getMimeTypeExtensions } from '@/utils/general';
import {
  IMAGE_FILE_ACCEPTED_MIME_TYPES,
  IMAGE_FILE_MAX_SIZE_BYTES,
} from '@/utils/validation';

import { Avatar } from '../Avatar/Avatar';
import { Button } from '../Button/Button';
import { Spinner } from '../Spinner/Spinner';

export const AVATAR_INPUT_TEST_ID = 'avatar-input';

const acceptedFileTypes = getMimeTypeExtensions(IMAGE_FILE_ACCEPTED_MIME_TYPES);
const maxFileSize = IMAGE_FILE_MAX_SIZE_BYTES / (1024 * 1024);

export function AvatarUploader() {
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
              accept={IMAGE_FILE_ACCEPTED_MIME_TYPES.join(', ')}
              className="invisible"
              data-testid={AVATAR_INPUT_TEST_ID}
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
            className="border-accent-500 bg-accent-800 text-light-500 disabled:border-accent-700 disabled:bg-accent-900 disabled:text-light-800 flex-1 transition-colors"
            disabled={!avatarPreviewUrl || isLoading}
            onClick={avatarUploadHandler}
          >
            {isLoading ? (
              <Spinner className="stroke-alpha-grey-900 fill-alpha-grey-900 m-auto h-full" />
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
  );
}
