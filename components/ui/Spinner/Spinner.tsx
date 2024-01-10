import { twMerge } from 'tailwind-merge';

const DEFAULT_COLOR = '#fff';

type SpinnerProps = {
  color?: string;
  className?: string;
};

export function Spinner({
  color = DEFAULT_COLOR,
  className = '',
}: SpinnerProps) {
  return (
    <svg
      className={twMerge('aspect-square h-8', className)}
      viewBox="-25 -25 230 230"
    >
      <path
        d="M90 180A90 90 0 1 1 90 0a90 90 0 0 1 0 180Z"
        fill="none"
        id="spinner-path"
        stroke={color}
        strokeOpacity="0.5"
        strokeWidth="5"
      />

      <circle fill={color} r="25">
        <animateMotion dur="1s" repeatCount="indefinite">
          <mpath href="#spinner-path" />
        </animateMotion>
      </circle>
    </svg>
  );
}
