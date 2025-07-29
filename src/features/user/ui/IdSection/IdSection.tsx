import { IdClipboardInput } from '../../../../features/user/ui/IdClipboardInput/IdClipboardInput';
import { Section } from '../../../dashboard/ui/section/section';

type IdSectionProps = {
  id?: string;
};

export function IdSection({ id }: IdSectionProps) {
  return (
    <Section>
      <Section.Heading headingLevel="h2">ID</Section.Heading>
      <Section.Text>This ID uniquely identifies your profile.</Section.Text>
      <Section.Subtext className="my-4">
        You can share it with another users to manage cars ownerships. Click on
        it to automatically copy it to your clipboard.
      </Section.Subtext>
      <IdClipboardInput id={id} />
    </Section>
  );
}
