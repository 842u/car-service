import { CarOwnership, Profile } from '@/types';

import { AvatarImage } from '../AvatarImage/AvatarImage';

type CarOwnershipTableRowProps = {
  profileData?: Profile | null;
  ownershipData?: CarOwnership[];
};

export function CarOwnershipTableRow({
  profileData,
  ownershipData,
}: CarOwnershipTableRowProps) {
  return (
    <tr className="whitespace-nowrap">
      <td className="border-alpha-grey-200 w-10 border p-2 text-center align-middle">
        <input type="checkbox" />
      </td>
      <td className="border-alpha-grey-200 hidden border p-2 text-center align-middle md:table-cell md:w-12">
        <AvatarImage
          className="aspect-square overflow-hidden rounded-full"
          src={profileData?.avatar_url}
        />
      </td>
      <td className="border-alpha-grey-200 max-w-[100px] overflow-auto border p-2 text-center align-middle md:table-cell">
        {profileData?.username}
      </td>
      <td className="border-alpha-grey-200 max-w-[100px] overflow-auto border p-2 text-center align-middle">
        {profileData?.id}
      </td>
      <td className="border-alpha-grey-200 w-10 border p-2 text-center align-middle">
        {ownershipData?.find(
          (ownership) =>
            ownership.owner_id === profileData?.id &&
            ownership.is_primary_owner,
        ) ? (
          <input checked readOnly type="checkbox" />
        ) : (
          <input readOnly checked={false} type="checkbox" />
        )}
      </td>
    </tr>
  );
}
