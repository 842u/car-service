/* eslint @next/next/no-img-element:0 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageProps, StaticImageData } from 'next/image';
import { ComponentType, ReactElement } from 'react';

import { ToastsProvider } from '@/components/providers/ToastsProvider';
import { UserProfileProvider } from '@/components/providers/UserProfileProvider';
import { UserProfile } from '@/types';
import { getMimeTypeExtensions } from '@/utils/general';
import {
  AVATAR_ACCEPTED_MIME_TYPES,
  AVATAR_MAX_FILE_SIZE_BYTES,
} from '@/utils/validation';

import { AVATAR_TEST_ID } from '../Avatar/Avatar';
import { SPINNER_TEST_ID } from '../Spinner/Spinner';
import { Toaster } from '../Toaster/Toaster';
import { AVATAR_INPUT_TEST_ID, AvatarUploader } from './AvatarUploader';

const mockUserProfile = {
  avatar_url: 'http://origin_url',
  id: 'origin_id',
  username: 'origin_username',
} as const satisfies UserProfile;

const avatarFile = new File(
  [new Uint8Array(AVATAR_MAX_FILE_SIZE_BYTES)],
  'avatar.png',
  { type: AVATAR_ACCEPTED_MIME_TYPES[0] },
);
const avatarPreviewUrl = `blob:http://some/url/${avatarFile.name}`;

window.URL.revokeObjectURL = jest.fn();
window.URL.createObjectURL = jest.fn();
const mockUrlCreateObjectUrl = window.URL.createObjectURL as jest.Mock;
window.crypto.randomUUID = () =>
  `${Date.now()}-${Math.random()}-some-random-uuid`;

jest.mock('../../../utils/general.ts', () => ({
  ...jest.requireActual('../../../utils/general.ts'),
  fetchUserProfile: async () => mockUserProfile,
  hashFile: async (file: File) => file.name,
}));

const mockSupabaseStorageFromUpload = jest.fn();
const mockSupabaseFromUpdateEq = jest.fn();
jest.mock('@supabase/ssr', () => ({
  createBrowserClient: () => ({
    storage: {
      from: () => ({
        upload: mockSupabaseStorageFromUpload,
      }),
    },
    from: () => ({
      update: () => ({
        eq: mockSupabaseFromUpdateEq,
      }),
    }),
  }),
}));

interface ESModuleDefault<T> {
  readonly __esModule: true;
  readonly default: T;
}

type StaticRequire = ImageProps['src'] extends
  | infer T
  | StaticImageData
  | string
  ? T
  : never;

const mapStaticImportToSrc = (
  staticImport: StaticImageData | StaticRequire,
): string => {
  if ('default' in staticImport) {
    return staticImport.default.src;
  }
  return staticImport.src;
};

const mapNextImageSrcToString = (
  src: StaticImageData | StaticRequire | string,
): string => {
  if (typeof src === 'string') {
    return src;
  }
  return mapStaticImportToSrc(src);
};

function MockNextImage({
  alt,
  height,
  src: nextImageSrc,
  width,
}: Readonly<ImageProps>): ReactElement {
  const imgSrc: string = mapNextImageSrcToString(nextImageSrc);
  return <img alt={alt} height={height} src={imgSrc} width={width} />;
}

jest.mock(
  'next/image',
  (): ESModuleDefault<ComponentType<ImageProps>> => ({
    __esModule: true,
    default: MockNextImage,
  }),
);

describe('AvatarUploader', () => {
  it('should render a file input', () => {
    render(<AvatarUploader />);

    const fileInput = screen.getByLabelText('upload avatar');

    expect(fileInput).toBeInTheDocument();
  });

  it('should render user avatar', () => {
    render(<AvatarUploader />);

    const avatar = screen.getByTestId(AVATAR_TEST_ID);

    expect(avatar).toBeInTheDocument();
  });

  it('should render info about accepted file types', () => {
    const regexp = new RegExp(
      getMimeTypeExtensions(AVATAR_ACCEPTED_MIME_TYPES),
      'i',
    );
    render(<AvatarUploader />);

    const fileTypesInfo = screen.getByText(regexp);

    expect(fileTypesInfo).toBeInTheDocument();
  });

  it('should render info about max file size in MB', () => {
    const regexp = new RegExp(
      `${AVATAR_MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`,
    );
    render(<AvatarUploader />);

    const fileTypesInfo = screen.getByText(regexp);

    expect(fileTypesInfo).toBeInTheDocument();
  });

  it('should render a button to save avatar change', () => {
    render(<AvatarUploader />);

    const saveButton = screen.getByRole('button', { name: /save/i });

    expect(saveButton).toBeInTheDocument();
  });

  it('should render a button to cancel avatar change', () => {
    render(<AvatarUploader />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    expect(cancelButton).toBeInTheDocument();
  });

  it('should disable buttons initially', () => {
    render(<AvatarUploader />);

    const saveButton = screen.getByRole('button', { name: /save/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    expect(saveButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('should enable buttons when user choose correct file', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const correctFiles = AVATAR_ACCEPTED_MIME_TYPES.map(
      (type) =>
        new File([new Uint8Array(AVATAR_MAX_FILE_SIZE_BYTES)], type, { type }),
    );
    render(<AvatarUploader />);

    const fileInput = screen.getByTestId(
      AVATAR_INPUT_TEST_ID,
    ) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: /save/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for (const file of correctFiles) {
      mockUrlCreateObjectUrl.mockReturnValueOnce(
        `http://some/url/${file.name}`,
      );
      await user.upload(fileInput, file);

      expect(fileInput.files).toHaveLength(1);
      expect(saveButton).toBeEnabled();
      expect(cancelButton).toBeEnabled();
      jest.resetAllMocks();
    }
    /* eslint-enable no-restricted-syntax, no-await-in-loop */
  });

  it('should disable buttons, revert avatar and display info when user choose incorrect file', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const wrongTypeFile = new File(
      [new Uint8Array(AVATAR_MAX_FILE_SIZE_BYTES)],
      'wrong_type_file.gif',
      {
        type: 'image/gif',
      },
    );
    const tooBigFile = new File(
      [new Uint8Array(AVATAR_MAX_FILE_SIZE_BYTES * 2)],
      'too_big_file.png',
      {
        type: AVATAR_ACCEPTED_MIME_TYPES[0],
      },
    );
    const incorrectFiles = [wrongTypeFile, tooBigFile];
    render(
      <ToastsProvider>
        <UserProfileProvider>
          <Toaster />
          <AvatarUploader />
        </UserProfileProvider>
      </ToastsProvider>,
    );

    const fileInput = screen.getByTestId(
      AVATAR_INPUT_TEST_ID,
    ) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: /save/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for (const file of incorrectFiles) {
      mockUrlCreateObjectUrl.mockReturnValueOnce(
        `http://some/url/${file.name}`,
      );

      await user.upload(fileInput, file);
      const userAvatar = screen.getByRole('img', { name: /user avatar/i });

      expect(fileInput.files).toHaveLength(0);
      expect(userAvatar).toHaveAttribute('src', mockUserProfile.avatar_url);
      expect(saveButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
      jest.resetAllMocks();
    }
    /* eslint-enable no-restricted-syntax, no-await-in-loop */
    const typeErrorMessage = screen.getByText(/File must be of type/i);
    const sizeErrorMessage = screen.getByText(/File size must be less than/i);

    expect(typeErrorMessage).toBeInTheDocument();
    expect(sizeErrorMessage).toBeInTheDocument();
  });

  it("should disable buttons, revert avatar and display info when user don't choose any file", async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(
      <ToastsProvider>
        <UserProfileProvider>
          <Toaster />
          <AvatarUploader />
        </UserProfileProvider>
      </ToastsProvider>,
    );

    const fileInput = screen.getByTestId(
      AVATAR_INPUT_TEST_ID,
    ) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: /save/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    await user.upload(fileInput, null as unknown as File);
    const errorMessage = screen.getByText(/you must select an file to upload/i);
    const userAvatar = screen.getByRole('img', { name: /user avatar/i });

    expect(fileInput.files).toHaveLength(0);
    expect(userAvatar).toHaveAttribute('src', mockUserProfile.avatar_url);
    expect(saveButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(errorMessage).toBeInTheDocument();
  });

  it('should display correct avatar preview on a correct file changes', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const correctFiles = AVATAR_ACCEPTED_MIME_TYPES.map(
      (type) =>
        new File([new Uint8Array(AVATAR_MAX_FILE_SIZE_BYTES)], type, { type }),
    );
    render(
      <UserProfileProvider>
        <AvatarUploader />
      </UserProfileProvider>,
    );

    const fileInput = screen.getByLabelText('upload avatar');
    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for (const file of correctFiles) {
      mockUrlCreateObjectUrl.mockReturnValueOnce(
        `blob:http://some/url/${file.name}`,
      );

      await user.upload(fileInput, file);
      const userAvatar = screen.getByRole('img', { name: /user avatar/i });

      expect(userAvatar).toHaveAttribute(
        'src',
        expect.stringContaining(file.name),
      );
      jest.resetAllMocks();
    }
    /* eslint-enable no-restricted-syntax, no-await-in-loop */
  });

  it('should disable buttons and revert avatar after cancel change', async () => {
    const user = userEvent.setup({ applyAccept: false });
    mockUrlCreateObjectUrl.mockReturnValueOnce(avatarPreviewUrl);
    render(
      <ToastsProvider>
        <UserProfileProvider>
          <Toaster />
          <AvatarUploader />
        </UserProfileProvider>
      </ToastsProvider>,
    );

    const fileInput = screen.getByLabelText(/upload avatar/i);
    const saveButton = screen.getByRole('button', { name: /save/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    await user.upload(fileInput, avatarFile);
    const userAvatar = screen.getByRole('img', { name: /user avatar/i });

    expect(userAvatar).toHaveAttribute('src', avatarPreviewUrl);

    await user.click(cancelButton);

    expect(userAvatar).toHaveAttribute('src', mockUserProfile.avatar_url);
    expect(saveButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('should disable buttons and show loading spinner on upload', async () => {
    const user = userEvent.setup({ applyAccept: false });
    mockUrlCreateObjectUrl.mockReturnValueOnce(avatarPreviewUrl);
    mockSupabaseStorageFromUpload.mockResolvedValueOnce({ error: null });
    render(
      <ToastsProvider>
        <UserProfileProvider>
          <Toaster />
          <AvatarUploader />
        </UserProfileProvider>
      </ToastsProvider>,
    );

    const fileInput = screen.getByLabelText(/upload avatar/i);
    const saveButton = screen.getByRole('button', { name: /save/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    await user.upload(fileInput, avatarFile);
    await user.click(saveButton);

    const loadingSpinner = screen.getByTestId(SPINNER_TEST_ID);

    expect(saveButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('should display correct avatar and success info on successful upload', async () => {
    const user = userEvent.setup();
    mockUrlCreateObjectUrl.mockReturnValue(avatarPreviewUrl);
    mockSupabaseStorageFromUpload.mockResolvedValueOnce({
      data: {
        id: 'id',
        path: 'public/avatar1.png',
        fullPath: 'avatars/public/avatar1.png',
      },
      error: null,
    });
    mockSupabaseFromUpdateEq.mockResolvedValueOnce({});
    render(
      <ToastsProvider>
        <UserProfileProvider>
          <Toaster />
          <AvatarUploader />
        </UserProfileProvider>
      </ToastsProvider>,
    );

    const fileInput = screen.getByLabelText('upload avatar');
    const saveButton = screen.getByRole('button', { name: /save/i });

    await user.upload(fileInput, avatarFile);
    await user.click(saveButton);

    const successToast = screen.getByRole('listitem', {
      name: /success notification: avatar uploaded successfully/i,
    });
    const userAvatar = screen.getByRole('img', { name: /user avatar/i });

    expect(successToast).toBeInTheDocument();
    expect(userAvatar).toHaveAttribute('src', avatarPreviewUrl);
  });

  it('should revert avatar and display error info on unsuccessful upload', async () => {
    const user = userEvent.setup();
    mockUrlCreateObjectUrl.mockReturnValue(avatarPreviewUrl);
    mockSupabaseStorageFromUpload.mockResolvedValueOnce({
      data: null,
      error: { message: 'storage upload error' },
    });
    mockSupabaseFromUpdateEq.mockResolvedValueOnce({});
    render(
      <ToastsProvider>
        <UserProfileProvider>
          <Toaster />
          <AvatarUploader />
        </UserProfileProvider>
      </ToastsProvider>,
    );

    const fileInput = screen.getByLabelText('upload avatar');
    const saveButton = screen.getByRole('button', { name: /save/i });

    await user.upload(fileInput, avatarFile);
    await user.click(saveButton);

    const errorToast = screen.getByRole('listitem', {
      name: /error notification:/i,
    });
    const userAvatar = screen.getByRole('img', { name: /user avatar/i });

    expect(errorToast).toBeInTheDocument();
    expect(userAvatar).toHaveAttribute('src', mockUserProfile.avatar_url);
  });
});
