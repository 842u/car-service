import { LinkButton } from '@/components/ui/LinkButton/LinkButton';

import { Section } from '../Section';

export function HeroSection() {
  return (
    <Section
      aria-label="welcome motto"
      className="mt-0 flex h-[50vh] flex-col items-center justify-center pt-16 text-center lg:mt-0 lg:h-screen"
    >
      <h1 className="text-3xl font-semibold md:text-5xl md:font-medium lg:text-6xl">
        <p className="from-dark-100 to-dark-500 dark:from-light-400 dark:to-light-800 bg-linear-to-b bg-clip-text leading-tight text-[transparent]">
          Car&apos;s Story Safely Managed.
        </p>
        <p className="from-accent-200 to-accent-800 mt-1 bg-linear-to-b bg-clip-text leading-tight text-[transparent]">
          Store, Track, Drive.
        </p>
      </h1>

      <div className="flex flex-col items-center justify-center md:w-2/3">
        <p className="my-6 text-sm md:text-base lg:my-10 lg:text-lg">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere
          commodi placeat atque nemo quo fugiat, iste earum omnis molestias id
          vero. Eligendi laudantium iusto at.
        </p>
        <div className="flex gap-2">
          <LinkButton href="/dashboard/sign-up">Sign Up</LinkButton>
          <LinkButton
            className="border-alpha-grey-500 bg-dark-400"
            href="/dashboard/sign-in"
          >
            Sign In
          </LinkButton>
        </div>
      </div>
    </Section>
  );
}
