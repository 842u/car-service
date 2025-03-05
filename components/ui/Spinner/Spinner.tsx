import { twMerge } from 'tailwind-merge';

export const SPINNER_TEST_ID = 'loading spinner';

type SpinnerProps = {
  className?: string;
};

export function Spinner({ className = '' }: SpinnerProps) {
  return (
    <svg
      className={twMerge('aspect-square h-8', className)}
      data-testid={SPINNER_TEST_ID}
      viewBox="-25 -25 230 230"
    >
      <path
        d="M90 180A90 90 0 1 1 90 0a90 90 0 0 1 0 180Z"
        fill="none"
        id="spinner-path"
        strokeOpacity="0.5"
        strokeWidth="5"
      />

      <circle r="25">
        <animateMotion dur="1s" repeatCount="indefinite">
          <mpath href="#spinner-path" />
        </animateMotion>
      </circle>
    </svg>
  );
}
