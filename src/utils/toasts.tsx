import { CheckCircleIcon } from '@/features/common/ui/decorative/icons/check-circle';
import { ExclamationCircleIcon } from '@/features/common/ui/decorative/icons/exclamation-circle';
import { ExclamationTriangleIcon } from '@/features/common/ui/decorative/icons/exclamation-triangle';
import { InformationCircleIcon } from '@/features/common/ui/decorative/icons/information-circle';
import type { ToastAsset, ToastType } from '@/types';

const errorIcon = (
  <ExclamationCircleIcon className="stroke-error-500 h-full w-full stroke-2" />
);
const errorClassName = 'border-error-500';

const warningIcon = (
  <ExclamationTriangleIcon className="stroke-warning-600 h-full w-full stroke-2" />
);
const warningClassName = 'border-warning-600';

const successIcon = (
  <CheckCircleIcon className="stroke-success-700 h-full w-full stroke-2" />
);
const successClassName = 'border-success-700';

const infoIcon = (
  <InformationCircleIcon className="stroke-light-500 h-full w-full stroke-2" />
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
        style: successClassName,
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
