'use client';

import type { MotionProps } from 'motion/react';
import { AnimatePresence, LazyMotion } from 'motion/react';
import { useEffect, useRef } from 'react';

import { useToasts } from '@/common/hooks/use-toasts';

import { ToasterToast } from './toast/toast';

const TOAST_LIFETIME = 6000;

type ToasterProps = {
  maxToasts?: number;
  toastLifeTime?: number;
};

const ToastsAnimation: MotionProps = {
  layout: true,
  transition: {
    ease: 'anticipate',
  },
  initial: { opacity: 0, scale: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.5, opacity: 0.5 },
};

const framerFeatures = () =>
  import('@/utils/motion/motion').then((mod) => mod.default);

export function Toaster({
  maxToasts = 3,
  toastLifeTime = TOAST_LIFETIME,
}: ToasterProps) {
  const { toasts, removeToast } = useToasts();

  const toastCloseInterval = useRef<NodeJS.Timeout>(undefined);

  const handleToasterMouseOver = () => {
    clearInterval(toastCloseInterval.current);
  };

  const handleToasterMouseLeave = () => {
    toastCloseInterval.current = setInterval(() => {
      const latestToastId = toasts.at(-1)?.id;

      if (latestToastId) {
        removeToast(latestToastId);
      }
    }, toastLifeTime);
  };

  useEffect(() => {
    toastCloseInterval.current = setInterval(() => {
      const latestToastId = toasts.at(-1)?.id;

      if (latestToastId) {
        removeToast(latestToastId);
      }
    }, toastLifeTime);

    return () => clearInterval(toastCloseInterval.current);
  }, [removeToast, toasts, toastLifeTime]);

  return (
    <section
      aria-label="notifications"
      className="fixed bottom-0 z-50 w-full p-2 md:right-0 md:m-5 md:max-w-sm"
    >
      <ol
        className="relative"
        onBlur={handleToasterMouseLeave}
        onFocus={handleToasterMouseOver}
        onMouseLeave={handleToasterMouseLeave}
        onMouseOver={handleToasterMouseOver}
      >
        <LazyMotion features={framerFeatures}>
          <AnimatePresence mode="popLayout">
            {toasts.map((toast, index) => {
              if (index < toasts.length - maxToasts) {
                return;
              }

              return (
                <ToasterToast
                  key={toast.id}
                  id={toast.id}
                  message={toast.message}
                  type={toast.type}
                  {...ToastsAnimation}
                />
              );
            })}
          </AnimatePresence>
        </LazyMotion>
      </ol>
    </section>
  );
}
