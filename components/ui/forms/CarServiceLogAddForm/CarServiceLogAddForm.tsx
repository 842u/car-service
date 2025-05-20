import { Button } from '../../shared/base/Button/Button';
import { Form } from '../../shared/base/Form/Form';

export function CarServiceLogAddForm() {
  return (
    <Form variant="raw">
      FORM
      <Form.Controls>
        <Button>Reset</Button>
        <Form.ButtonSubmit>Save</Form.ButtonSubmit>
      </Form.Controls>
    </Form>
  );
}
