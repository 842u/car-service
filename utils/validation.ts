export const emailValidationRules = {
  required: 'This field is required.',
  minLength: {
    value: 3,
    message: 'Minimum length is 3.',
  },
  maxLength: {
    value: 254,
    message: 'Maximum length is 254.',
  },
  pattern: {
    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
    message: 'Enter valid e-mail adress.',
  },
};

export const passwordValidationRules = {
  required: 'This field is required.',
  minLength: {
    value: 6,
    message: 'Minimum length is 6.',
  },
  maxLength: {
    value: 256,
    message: 'Maximum length is 256.',
  },
};
