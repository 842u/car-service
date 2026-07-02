'use client';

import { AnimatePresence, LazyMotion } from 'motion/react';
import { useState } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';

import { ToasterToast } from './toast/toast';

type ToasterProps = {
  maxToasts?: number;
  toastLifeTime?: number;
};

const framerFeatures = () =>
  import('@/lib/motion/motion').then((mod) => mod.default);

export function Toaster({ maxToasts = 3, toastLifeTime }: ToasterProps) {
  const { toasts } = useToasts();
  const [paused, setPaused] = useState(false);

  return (
    <section
      aria-label="notifications"
      className="fixed bottom-0 z-50 w-full p-2 md:right-0 md:m-5 md:max-w-sm"
    >
      <ol
        className="relative"
        onBlur={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onMouseOver={() => setPaused(true)}
      >
        <LazyMotion features={framerFeatures}>
          <AnimatePresence mode="popLayout">
            {toasts.slice(-maxToasts).map((toast) => (
              <ToasterToast
                key={toast.id}
                id={toast.id}
                message={toast.message}
                paused={paused}
                toastLifeTime={toastLifeTime}
                type={toast.type}
              />
            ))}
          </AnimatePresence>
        </LazyMotion>
      </ol>
    </section>
  );
}
