import { CheckCircleIcon } from '@/icons/check-circle';
import { ExclamationCircleIcon } from '@/icons/exclamation-circle';
import { ExclamationTriangleIcon } from '@/icons/exclamation-triangle';

type ExpirationStatus = 'expired' | 'less_than_month' | 'valid';

function getExpirationStatus(date: string): ExpirationStatus {
  const now = new Date();
  const expiration = new Date(date);

  const diffMs = expiration.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return 'expired';
  if (diffDays <= 30) return 'less_than_month';

  return 'valid';
}

const STATUS_CONFIG = {
  expired: {
    Icon: ExclamationTriangleIcon,
    iconClassName: 'stroke-error-500',
    label: 'Expired',
  },
  less_than_month: {
    Icon: ExclamationCircleIcon,
    iconClassName: 'stroke-warning-500',
    label: 'Expires within 30 days',
  },
  valid: {
    Icon: CheckCircleIcon,
    iconClassName: 'stroke-success-500',
    label: 'Valid',
  },
};

interface useDateExpirationStatusIconParams {
  date: string;
  label?: string;
}

export function useDateExpirationStatusIcon({
  date,
  label,
}: useDateExpirationStatusIconParams) {
  const status = getExpirationStatus(date);

  const { Icon, iconClassName, label: statusLabel } = STATUS_CONFIG[status];

  const tooltip = label ? `${label}: ${statusLabel}` : statusLabel;

  return {
    Icon,
    iconClassName,
    tooltip,
  };
}
