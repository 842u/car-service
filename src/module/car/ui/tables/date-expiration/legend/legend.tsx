import { CheckCircleIcon } from '@/icons/check-circle';
import { ExclamationCircleIcon } from '@/icons/exclamation-circle';
import { ExclamationTriangleIcon } from '@/icons/exclamation-triangle';

export function DateExpirationTableLegend() {
  return (
    <div className="mt-5 flex justify-evenly gap-6 text-sm md:m-5 md:justify-start">
      <div className="flex items-center gap-1">
        <CheckCircleIcon className="stroke-success-500 h-4 stroke-2" />
        Valid
      </div>

      <div className="flex items-center gap-1 text-nowrap">
        <ExclamationCircleIcon className="stroke-warning-500 h-4 stroke-2" />
        Expires soon
      </div>

      <div className="flex items-center gap-1">
        <ExclamationTriangleIcon className="stroke-error-500 h-4 stroke-2" />
        Expired
      </div>
    </div>
  );
}
