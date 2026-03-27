import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function EngineIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M3 15.4v12.8M3 41V28.2m0 0h6.43m0 0v-5.4a1 1 0 0 1 1-1h3.66a1 1 0 0 0 .78-.37l4.54-5.66a1 1 0 0 1 .78-.37h4.02M9.43 28.2v7.96a1 1 0 0 0 1 1h3.6a1 1 0 0 1 .84.44l1.98 2.96a1 1 0 0 0 .83.44h15.64a1 1 0 0 0 .83-.44l4.55-6.8a1 1 0 0 1 .83-.44h1.04a1 1 0 0 1 1 1v3.12a1 1 0 0 0 1 1H47a1 1 0 0 0 1-1V16.4a1 1 0 0 0-1-1h-4.43a1 1 0 0 0-1 1v4.4a1 1 0 0 1-1 1h-6.23a1 1 0 0 1-.78-.37L29 15.77a1 1 0 0 0-.78-.37h-4.02m0 0V9m0 0h8.36m-8.36 0h-8.35" />
    </SvgA11y>
  );
}
