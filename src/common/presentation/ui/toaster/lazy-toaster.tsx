'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Toaster = dynamic(() => import('./toaster').then((mod) => mod.Toaster), {
  ssr: false,
});

export default function LazyToaster() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    setShouldLoad(true);
  }, []);

  return shouldLoad && <Toaster />;
}
