import { UseFormRegister } from 'react-hook-form';
import { twJoin } from 'tailwind-merge';

import { KeyIcon } from '@/components/decorative/icons/KeyIcon';
import { CarOwnership, Profile } from '@/types';

import { CarOwnershipDeleteFormValues } from '../../forms/CarOwnershipDeleteForm/CarOwnershipDeleteForm';
import { AvatarImage } from '../../images/AvatarImage/AvatarImage';

type CarOwnershipTableRowProps = {
  register?: UseFormRegister<CarOwnershipDeleteFormValues>;
  disabled?: boolean;
  profileData?: Profile | null;
  ownershipData?: CarOwnership[];
};

export function CarOwnershipTableRow({
  register,
  profileData,
  ownershipData,
  disabled = false,
}: CarOwnershipTableRowProps) {
  return (
    <tr className={twJoin('whitespace-nowrap', disabled && 'text-light-900')}>
      <td className="border-alpha-grey-200 relative w-10 border-t">
        <label
          className="absolute top-0 left-0 flex h-full w-full justify-center"
          htmlFor={profileData?.id}
        >
          <input
            className="accent-accent-500"
            disabled={disabled}
            id={profileData?.id}
            type="checkbox"
            {...(register ? register('ownersIds') : {})}
            value={profileData?.id}
          />
          <span className="sr-only">Select user</span>
        </label>
      </td>

      <td className="border-alpha-grey-200 hidden border border-b-0 p-2 text-center align-middle md:table-cell md:w-12">
        <AvatarImage
          className="aspect-square overflow-hidden rounded-full"
          src={profileData?.avatar_url}
        />
      </td>

      <td className="border-alpha-grey-200 max-w-[100px] overflow-auto border border-b-0 p-2 text-center align-middle md:table-cell">
        {profileData?.username}
      </td>

      <td className="border-alpha-grey-200 max-w-[100px] overflow-auto border border-b-0 p-2 text-center align-middle">
        {profileData?.id}
      </td>

      <td className="border-alpha-grey-200 w-10 border-t p-2 text-center align-middle">
        {ownershipData?.find(
          (ownership) =>
            ownership.owner_id === profileData?.id &&
            ownership.is_primary_owner,
        ) ? (
          <KeyIcon className="stroke-accent-400 m-auto w-5 stroke-3 md:w-6" />
        ) : (
          <KeyIcon className="stroke-alpha-grey-300 m-auto w-5 stroke-3 md:w-6" />
        )}
      </td>
    </tr>
  );
}
