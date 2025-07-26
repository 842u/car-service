import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';

import { defaultAvatarFormValues } from '@/components/ui/forms/AvatarForm/useAvatarForm';
import {
  avatarFormSchema,
  AvatarFormValues,
} from '@/schemas/zod/avatarFormSchema';

import { Form } from '../Form';
import {
  FORM_INPUT_IMAGE_TEST_ID,
  FormInputImage,
  FormInputImageProps,
} from './FormInputImage';

const INPUT_LABEL_TEXT = 'testLabel';

function TestFormInputImage({
  ...props
}: FormInputImageProps<AvatarFormValues>) {
  const { control } = useForm<AvatarFormValues>({
    resolver: zodResolver(avatarFormSchema),
    mode: 'onChange',
    defaultValues: defaultAvatarFormValues,
  });

  return (
    <Form>
      <FormInputImage<AvatarFormValues>
        control={control}
        label={INPUT_LABEL_TEXT}
        {...props}
      />
    </Form>
  );
}

describe('FormInputImage', () => {
  it('should render as a input element of type="file"', () => {
    render(<TestFormInputImage name="image" />);

    const inputElement = screen.getByTestId(FORM_INPUT_IMAGE_TEST_ID);

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'file');
  });

  it('should render usage info if withInfo', () => {
    render(<TestFormInputImage name="image" withInfo={true} />);

    const usageInfo = screen.getByText(
      'Click on the image to upload a custom one.',
    );
    const fileTypeInfo = screen.getByText(/accepted file types/i);
    const fileSizeInfo = screen.getByText(/max file size/i);

    expect(usageInfo).toBeInTheDocument();
    expect(fileTypeInfo).toBeInTheDocument();
    expect(fileSizeInfo).toBeInTheDocument();
  });

  it('should render error if showErrorMessage & errorMessage', () => {
    const errorMessage = 'testError';
    render(
      <TestFormInputImage
        errorMessage={errorMessage}
        name="image"
        showErrorMessage={true}
      />,
    );

    const error = screen.getByText(errorMessage);

    expect(error).toBeInTheDocument();
  });
});
