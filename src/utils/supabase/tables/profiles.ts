import type { Profile } from '@/types';
import { hashFile } from '@/utils/general';

import { createClient } from '../client';

export async function getCurrentSessionProfile() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error)
    throw new Error(error?.message || "Can't get user profile.");

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError)
    throw new Error(profileError.message || "Can't get user profile.");

  return profileData;
}

type PatchProfileParameters =
  | {
      property: Extract<keyof Profile, 'avatar_url'>;
      value: File | null | undefined;
    }
  | { property: Extract<keyof Profile, 'username'>; value: string | null };

export async function updateCurrentSessionProfile({
  property,
  value,
}: PatchProfileParameters) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    throw new Error("Error on updating profile. Can't get user session.");

  if (property === 'avatar_url') {
    if (!value)
      throw new Error(
        'Error on uploading avatar. No file was found. Try again.',
      );

    const hashedFile = await hashFile(value);

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(`${user.id}/${hashedFile}`, value);

    if (error)
      throw new Error(error.message || 'Error on uploading avatar. Try again.');

    return data;
  } else {
    const { data, error } = await supabase
      .from('profiles')
      .update({ [property]: value })
      .eq('id', user.id)
      .select();

    if (error)
      throw new Error(error.message || 'Error on updating profile. Try again.');

    return data;
  }
}

export async function getProfileByUserId(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message || "Can't get user profile.");

  return data;
}

export async function getProfilesByUsersId(usersId: string[]) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .in('id', usersId);

  if (error) throw new Error(error.message || "Can't get users profiles.");

  return data;
}
