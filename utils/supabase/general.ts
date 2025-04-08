import { Provider } from '@supabase/supabase-js';
import { Route } from 'next';

import { Profile } from '@/types';

import { hashFile } from '../general';
import { createClient } from './client';

const supabaseAppUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const testUserEmail = process.env.SUPABASE_TEST_USER_EMAIL!;
const testUserPassword = process.env.SUPABASE_TEST_USER_PASSWORD!;

export async function createTestUser(testUserIndex: number) {
  const supabase = createClient(supabaseAppUrl, supabaseServiceRoleKey);
  const email = testUserIndex + testUserEmail;
  const password = testUserPassword;

  try {
    const { error } = await supabase.auth.admin.createUser({
      email: testUserIndex + testUserEmail,
      password: testUserPassword,
      email_confirm: true,
    });

    if (error) throw new Error(error.message);
  } catch (error) {
    if (error instanceof Error)
      throw new Error(error?.message || 'Error on creating test user.');
  }

  return { email, password };
}

export async function deleteTestUser(testUserIndex: number) {
  const supabase = createClient(supabaseAppUrl, supabaseServiceRoleKey);
  try {
    const { status, error } = await supabase.rpc('delete_test_user', {
      test_user_index: testUserIndex,
    });
    if ((status < 200 && status >= 300) || error)
      throw new Error(error?.message);
  } catch (error) {
    if (error instanceof Error)
      throw new Error(error?.message || 'Error on deleting test user.');
  }
}

export async function signInWithOAuthHandler(provider: Provider) {
  const { auth } = createClient();
  const requestUrl = new URL(window.location.origin);

  requestUrl.pathname = '/api/auth/callback' satisfies Route;

  const response = await auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: requestUrl.href,
    },
  });

  return response;
}

export async function getCurrentSessionProfile() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id);

  if (profileError)
    throw new Error(profileError.message || "Can't get user profile.");

  return profileData[0];
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

export async function getProfile(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message || "Can't get user profile.");

  return data;
}

export async function getCarOwnerships(carId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('cars_ownerships')
    .select()
    .eq('car_id', carId);

  if (error) throw new Error(error.message);

  return data;
}

export async function deleteCarOwnershipsByUsersIds(
  carId: string,
  usersIds: string[],
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('cars_ownerships')
    .delete()
    .eq('car_id', carId)
    .in('owner_id', usersIds)
    .select();

  if (error) throw new Error(error.message || "Can't delete car owner.");

  if (!data.length)
    throw new Error(
      'Something went wrong when deleting car ownership. Try Again.',
    );

  return data;
}

export async function addCarOwnershipByUserId(
  carId: string,
  userId: string | null,
) {
  if (!userId) throw new Error('You must provide a new owner ID.');

  const supabase = createClient();

  const { data, error } = await supabase
    .from('cars_ownerships')
    .insert({ car_id: carId, owner_id: userId, is_primary_owner: false })
    .select()
    .single();

  if (error) throw new Error(error.message || "Can't add new car owner.");

  return data;
}

export async function updateCarPrimaryOwnershipByUserId(
  carId: string,
  newPrimaryOwnerId: string | null,
) {
  if (!newPrimaryOwnerId)
    throw new Error('You must provide a new primary owner ID.');

  const supabase = createClient();

  const { data, error } = await supabase.rpc('switch_primary_car_owner', {
    new_primary_owner_id: newPrimaryOwnerId,
    target_car_id: carId,
  });

  if (error) throw new Error(error.message);

  return data;
}
