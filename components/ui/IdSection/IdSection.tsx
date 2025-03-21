import { SettingsSection } from '../SettingsSection/SettingsSection';

type IdSectionProps = {
  id?: string;
};

export function IdSection({ id }: IdSectionProps) {
  return (
    <SettingsSection headingText="ID">
      <div className="text-sm">
        <p
          className="border-alpha-grey-300 my-4 cursor-pointer rounded-md border py-2 text-center whitespace-pre-wrap"
          onClick={async () => {
            if (!id) return;

            const clipboardItemData = {
              'text/plain': id,
            };

            const clipboardItem = new ClipboardItem(clipboardItemData);

            await navigator.clipboard.write([clipboardItem]);
          }}
        >
          {id || ' '}
        </p>
        <p>This ID uniquely identifies your profile.</p>
        <p className="text-alpha-grey-700">
          You can share it with another users to manage cars ownerships. Click
          on it to automatically copy it to your clipboard.
        </p>
      </div>
    </SettingsSection>
  );
}
