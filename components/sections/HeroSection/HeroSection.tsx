import { LinkButton } from '@/components/ui/LinkButton/LinkButton';

export function HeroSection() {
  return (
    <section
      aria-labelledby="welcome motto"
      className="m-auto mt-16 flex h-[50vh] w-10/12 max-w-7xl flex-col items-center justify-center text-center lg:mt-0 lg:h-screen"
    >
      <h1 className="text-3xl font-semibold md:text-5xl md:font-medium lg:text-6xl">
        <p className="bg-gradient-to-b from-dark-100 to-dark-500 bg-clip-text leading-tight text-[transparent] dark:from-light-400 dark:to-light-800">
          Car&apos;s Story Safely Managed.
        </p>
        <p className="mt-1 bg-gradient-to-b from-accent-200 to-accent-800 bg-clip-text leading-tight text-[transparent]">
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
          <LinkButton className="px-5 text-sm" href="/dashboard/sign-up">
            Sign Up
          </LinkButton>
          <LinkButton
            className="border-alpha-grey-500 bg-dark-400 px-5 text-sm"
            href="/dashboard/sign-up"
          >
            Sign In
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
