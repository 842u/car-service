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
    <section className="border-alpha-grey-200 bg-alpha-grey-100 flex w-5/6 flex-col items-center rounded-md border p-4 md:max-w-md lg:max-w-xl">
      <h2 className="self-start text-xl">{headingText}</h2>
      <div className="bg-alpha-grey-200 my-4 h-[1px] w-full" />
      {children}
    </section>
  );
}
