import type { MotionProps } from 'motion/react';
import * as m from 'motion/react-m';
import type { JSX, Ref } from 'react';
import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { CheckCircleIcon } from '@/icons/check-circle';
import { ExclamationCircleIcon } from '@/icons/exclamation-circle';
import { ExclamationTriangleIcon } from '@/icons/exclamation-triangle';
import { InformationCircleIcon } from '@/icons/information-circle';
import { XCircleIcon } from '@/icons/x-circle';
import { IconButton } from '@/ui/icon-button/icon-button';

const TOAST_LIFETIME = 6000;

const toastAnimation: MotionProps = {
  layout: true,
  transition: { ease: 'anticipate' },
  initial: { opacity: 0, scale: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.5, opacity: 0.5 },
};

type ToasterToastProps = {
  id: string;
  message: string;
  type: ToastType;
  className?: string;
  ref?: Ref<HTMLLIElement>;
  paused: boolean;
  toastLifeTime?: number;
  onRemove: () => void;
};

export type ToastType = 'info' | 'success' | 'error' | 'warning';

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  dedupeKey?: string;
};

export type ToastAsset = {
  style: string;
  icon: JSX.Element;
};

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

export function getToastAssets(type: ToastType) {
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
  }
}

export function ToasterToast({
  message,
  id,
  type,
  className,
  ref,
  paused,
  toastLifeTime = TOAST_LIFETIME,
  onRemove,
}: ToasterToastProps) {
  const onRemoveRef = useRef(onRemove);
  onRemoveRef.current = onRemove;

  useEffect(() => {
    if (paused) return;
    const timeout = setTimeout(() => onRemoveRef.current(), toastLifeTime);
    return () => clearTimeout(timeout);
  }, [paused, toastLifeTime]);

  const { style, icon } = getToastAssets(type);

  return (
    <m.li
      ref={ref}
      {...toastAnimation}
      aria-label={`${type} notification: ${message}`}
      className={twMerge(
        'border-alpha-grey-300 bg-light-600 dark:bg-dark-600 my-2 flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm',
        style,
        className,
      )}
      id={id}
    >
      <div className="h-10 shrink-0 p-2">{icon}</div>
      <span className="max-h-20 overflow-auto">{message}</span>
      <IconButton
        aria-label="close notification"
        className="aspect-square h-10 shrink-0 p-2"
        title="close toast"
        onClick={onRemove}
      >
        <XCircleIcon className="stroke-dark-500 dark:stroke-light-500 h-full w-full stroke-2" />
      </IconButton>
    </m.li>
  );
}
