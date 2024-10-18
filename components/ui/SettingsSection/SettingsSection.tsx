import { ReactNode } from 'react';

type SettingsSectionProps = {
  headingText: string;
  children?: ReactNode;
};

export function SettingsSection({
  headingText,
  children,
}: SettingsSectionProps) {
  return (
    <section className="flex w-5/6 flex-col items-center rounded-md border border-alpha-grey-200 bg-alpha-grey-100 p-4 md:max-w-md lg:max-w-xl">
      <h2 className="self-start text-xl">{headingText}</h2>
      <div className="my-4 h-[1px] w-full bg-alpha-grey-200" />
      {children}
    </section>
  );
}
