import { LinkButton } from '@/components/ui/shared/LinkButton/LinkButton';

import { LandingSection } from '../../ui/shared/LandingSection/LandingSection';

export function HeroSection() {
  return (
    <LandingSection className="flex h-screen flex-col items-center justify-center gap-5 text-center md:gap-10 lg:my-0 lg:gap-14">
      <h1 className="text-3xl font-semibold md:text-5xl md:font-medium lg:text-6xl">
        <p className="from-dark-100 to-dark-500 dark:from-light-400 dark:to-light-800 bg-linear-to-b bg-clip-text leading-tight text-[transparent]">
          Car&apos;s Story Safely Managed.
        </p>
        <p className="from-accent-200 to-accent-800 mt-1 bg-linear-to-b bg-clip-text leading-tight text-[transparent]">
          Store, Track, Drive.
        </p>
      </h1>

      <div className="flex flex-col items-center justify-center gap-5 md:w-2/3 md:gap-10 lg:gap-14">
        <p className="text-sm md:text-base lg:text-lg">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere
          commodi placeat atque nemo quo fugiat, iste earum omnis molestias id
          vero. Eligendi laudantium iusto at.
        </p>
        <div className="flex gap-5 md:gap-10">
          <LinkButton href="/dashboard/sign-in">Sign In</LinkButton>
          <LinkButton href="/dashboard/sign-up" variant="accent">
            Sign Up
          </LinkButton>
        </div>
      </div>
    </LandingSection>
  );
}
