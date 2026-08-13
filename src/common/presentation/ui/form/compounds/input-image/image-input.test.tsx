import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';

import {
  type ImageFormData,
  imageFormSchema,
} from '@/common/interface/ui/image-form.schema';
import { Form } from '@/ui/form/form';
import { defaultAvatarFormValues } from '@/user/presentation/ui/forms/avatar/use-avatar';

import type { FormImageInputProps } from './image-input';
import { FORM_IMAGE_INPUT_TEST_ID, FormImageInput } from './image-input';

const INPUT_LABEL_TEXT = 'testLabel';

function TestFormImageInput({ ...props }: FormImageInputProps<ImageFormData>) {
  const { control } = useForm<ImageFormData>({
    resolver: zodResolver(imageFormSchema),
    mode: 'onChange',
    defaultValues: defaultAvatarFormValues,
  });

  return (
    <Form>
      <FormImageInput<ImageFormData>
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

  it('should mark the input invalid and describe it by the error text when errorMessage is set', () => {
    const errorMessage = 'testError';
    render(<TestFormImageInput errorMessage={errorMessage} name="image" />);

    const inputElement = screen.getByTestId(FORM_IMAGE_INPUT_TEST_ID);
    const error = screen.getByText(errorMessage);

    expect(inputElement).toHaveAttribute('aria-invalid', 'true');
    expect(inputElement).toHaveAttribute('aria-describedby', error.id);
  });

  it('should not mark the input invalid or describe it when there is no errorMessage', () => {
    render(<TestFormImageInput name="image" />);

    const inputElement = screen.getByTestId(FORM_IMAGE_INPUT_TEST_ID);

    expect(inputElement).not.toHaveAttribute('aria-invalid');
    expect(inputElement).not.toHaveAttribute('aria-describedby');
  });

  it('should reach the input element with the required attribute', () => {
    render(<TestFormImageInput name="image" required={true} />);

    const inputElement = screen.getByTestId(FORM_IMAGE_INPUT_TEST_ID);

    expect(inputElement).toBeRequired();
  });
});
