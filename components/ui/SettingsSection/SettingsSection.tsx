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
    <section className="border-alpha-grey-200 bg-alpha-grey-100 w-full rounded-md border p-4">
      <h2 className="text-xl">{headingText}</h2>
      <div className="bg-alpha-grey-200 my-4 h-[1px] w-full" />
      {children}
    </section>
  );
}
