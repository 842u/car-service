import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';

import type { AvatarFormValues } from '@/schemas/zod/avatarFormSchema';
import { avatarFormSchema } from '@/schemas/zod/avatarFormSchema';
import { Form } from '@/ui/form/form';
import { defaultAvatarFormValues } from '@/user/ui/forms/avatar/use-avatar';

import type { FormImageInputProps } from './image-input';
import { FORM_IMAGE_INPUT_TEST_ID, FormImageInput } from './image-input';

const INPUT_LABEL_TEXT = 'testLabel';

function TestFormImageInput({
  ...props
}: FormImageInputProps<AvatarFormValues>) {
  const { control } = useForm<AvatarFormValues>({
    resolver: zodResolver(avatarFormSchema),
    mode: 'onChange',
    defaultValues: defaultAvatarFormValues,
  });

  return (
    <Form>
      <FormImageInput<AvatarFormValues>
        control={control}
        label={INPUT_LABEL_TEXT}
        {...props}
      />
    </Form>
  );
}

describe('FormImageInput', () => {
  it('should render as a input element of type="file"', () => {
    render(<TestFormImageInput name="image" />);

    const inputElement = screen.getByTestId(FORM_IMAGE_INPUT_TEST_ID);

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'file');
  });

  it('should render usage info if withInfo', () => {
    render(<TestFormImageInput name="image" withInfo={true} />);

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
      <TestFormImageInput
        errorMessage={errorMessage}
        name="image"
        showErrorMessage={true}
      />,
    );

    const error = screen.getByText(errorMessage);

    expect(error).toBeInTheDocument();
  });
});
