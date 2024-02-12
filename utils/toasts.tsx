import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

import { ToastType } from '@/components/providers/ToastsProvider';

type ToastAsset = {
  style: string;
  icon: JSX.Element;
};

const errorIcon = (
  <ExclamationCircleIcon className="aspect-square w-6 flex-shrink-0 stroke-error-500" />
);
const errorClassName = 'border-error-500';

const warningIcon = (
  <ExclamationTriangleIcon className="aspect-square w-6 flex-shrink-0 stroke-warning-600" />
);
const warningClassName = 'border-warning-600';

const successIcon = (
  <CheckCircleIcon className="aspect-square w-6 flex-shrink-0 stroke-success-700" />
);
const succesClassName = 'border-success-700';

const infoIcon = (
  <InformationCircleIcon className="aspect-square w-6 flex-shrink-0 stroke-alpha-grey-700" />
);

export function getToastAssets(type: ToastType): ToastAsset | null {
  switch (type) {
    case 'error':
      return {
        style: errorClassName,
        icon: errorIcon,
      };

    case 'warning':
      return {
        style: warningClassName,
        icon: warningIcon,
      };

    case 'success':
      return {
        style: succesClassName,
        icon: successIcon,
      };

    case 'info':
      return {
        style: '',
        icon: infoIcon,
      };

    default:
      return null;
  }
}
