'use client';

import { AnimatePresence, LazyMotion } from 'framer-motion';
import { useContext, useEffect, useRef } from 'react';

import {
  ToastsContext,
  ToastsContextType,
} from '@/components/providers/ToastsProvider';

import { Toast } from '../Toast/Toast';

type ToasterProps = {
  maxToasts?: number;
  toastCloseTime?: number;
};

const loadFeatures = () =>
  import('../../../utils/framer-motion').then((mod) => mod.default);

export function Toaster({
  maxToasts = 3,
  toastCloseTime = 2000,
}: ToasterProps) {
  const { toasts, addToast, removeToast } = useContext(
    ToastsContext,
  ) as ToastsContextType;

  const toastCloseInterval = useRef<NodeJS.Timeout>();

  const addButtonClickHandler = () => {
    addToast(`${crypto.randomUUID().slice(0, 8)} toast`, 'success');
  };

  const toasterMouseOverHandler = () => {
    clearInterval(toastCloseInterval.current);
  };

  const toasterMouseLeaveHandler = () => {
    toastCloseInterval.current = setInterval(() => {
      const latestToastId = toasts.at(-1)?.id;

      if (latestToastId) {
        removeToast(latestToastId);
      }
    }, toastCloseTime);
  };

  useEffect(() => {
    toastCloseInterval.current = setInterval(() => {
      const latestToastId = toasts.at(-1)?.id;

      if (latestToastId) {
        removeToast(latestToastId);
      }
    }, toastCloseTime);

    return () => clearInterval(toastCloseInterval.current);
  }, [removeToast, toasts, toastCloseTime]);

  return (
    <>
      <button
        className="fixed bottom-1/2 left-0 m-10"
        type="button"
        onClick={addButtonClickHandler}
      >
        add
      </button>
      <section
        aria-label="notifications"
        className="fixed bottom-0 z-50 w-full p-2 md:right-0 md:m-5 md:max-w-sm"
      >
        <ol
          className="relative"
          onBlur={toasterMouseLeaveHandler}
          onFocus={toasterMouseOverHandler}
          onMouseLeave={toasterMouseLeaveHandler}
          onMouseOver={toasterMouseOverHandler}
        >
          <LazyMotion features={loadFeatures}>
            <AnimatePresence mode="popLayout">
              {toasts.map((toast, index) => {
                if (index < toasts.length - maxToasts) {
                  return;
                }

                return (
                  <Toast
                    key={toast.id}
                    id={toast.id}
                    message={toast.message}
                    type={toast.type}
                  />
                );
              })}
            </AnimatePresence>
          </LazyMotion>
        </ol>
      </section>
    </>
  );
}
