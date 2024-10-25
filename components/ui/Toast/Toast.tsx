import { m } from 'framer-motion';
import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  useContext,
} from 'react';
import { twMerge } from 'tailwind-merge';

import { XCircleIcon } from '@/components/decorative/icons/XCircleIcon';
import { ToastsContext } from '@/context/ToastsContext';
import { Toast as ToastObject } from '@/types';
import { getToastAssets } from '@/utils/toasts';

type ToastProps = ToastObject &
  ComponentPropsWithoutRef<typeof m.li> & {
    className?: string;
  };

export const Toast = forwardRef(
  (
    { message, id, type, className, ...props }: ToastProps,
    ref: ForwardedRef<HTMLLIElement>,
  ) => {
    const { removeToast } = useContext(ToastsContext);

    const { style, icon } = getToastAssets(type)!;

    const closeButtonClickHandler = () => {
      removeToast(id);
    };

    return (
      <m.li
        ref={ref}
        aria-label={`${type} notification: ${message}`}
        className={twMerge(
          'my-2 flex w-full items-center justify-between gap-2 rounded-lg border border-alpha-grey-300 bg-light-600 px-3 py-2 text-sm dark:bg-dark-600',
          style,
          className,
        )}
        id={id}
        {...props}
      >
        {icon}
        <span>{message}</span>
        <button
          aria-label="close notification"
          type="button"
          onClick={closeButtonClickHandler}
        >
          <XCircleIcon className="aspect-square w-6 flex-shrink-0 stroke-dark-500 stroke-[10] dark:stroke-light-500" />
        </button>
      </m.li>
    );
  },
);
