import { IdClipboardInput } from '../IdClipboardInput/IdClipboardInput';
import { DashboardSection } from '../shared/DashboardSection/DashboardSection';

type IdSectionProps = {
  id?: string;
};

export function IdSection({ id }: IdSectionProps) {
  return (
    <DashboardSection>
      <DashboardSection.Heading headingLevel="h2">ID</DashboardSection.Heading>
      <DashboardSection.Text>
        This ID uniquely identifies your profile.
      </DashboardSection.Text>
      <DashboardSection.Subtext className="my-4">
        You can share it with another users to manage cars ownerships. Click on
        it to automatically copy it to your clipboard.
      </DashboardSection.Subtext>
      <IdClipboardInput id={id} />
    </DashboardSection>
  );
}
