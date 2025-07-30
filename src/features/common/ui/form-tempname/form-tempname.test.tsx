import { render, screen } from '@testing-library/react';

import { Form } from './form-tempname';

describe('Form', () => {
  it('should render as a form element', () => {
    const testFormName = 'test';
    render(<Form aria-label={testFormName} />);

    const formElement = screen.getByRole('form', {
      name: testFormName,
    });

    expect(formElement).toBeInTheDocument();
  });

  it('should render provided children', () => {
    const childrenHeadingText = 'test';
    render(
      <Form>
        <h1>{childrenHeadingText}</h1>
      </Form>,
    );

    const childrenHeading = screen.getByRole('heading', {
      name: childrenHeadingText,
    });

    expect(childrenHeading).toBeInTheDocument();
  });
});
