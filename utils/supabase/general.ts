import { Provider } from '@supabase/supabase-js';
import { Route } from 'next';

import { ApiCarRequestBody, ApiCarResponse } from '@/app/api/car/route';
import { CarFormValues } from '@/schemas/zod/carFormSchema';
import { Profile, RouteHandlerResponse } from '@/types';

import { CAR_IMAGE_UPLOAD_ERROR_CAUSE, hashFile } from '../general';
import { CARS_INFINITE_QUERY_PAGE_DATA_LIMIT } from '../tanstack/general';
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

export async function handleCarFormSubmit(
  formData: CarFormValues,
  carId: string | null,
  method: 'POST' | 'PATCH',
) {
  const { image, ...data } = formData;

  const jsonDataToValidate = JSON.stringify({
    carFormData: data,
    carId,
  } satisfies ApiCarRequestBody);

  const url = new URL(window.location.origin);
  url.pathname = '/api/car' satisfies Route;

  let newCarResponse: Response | null = null;

  try {
    newCarResponse = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonDataToValidate,
    });
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }

  const { data: responseData, error } =
    (await newCarResponse?.json()) as RouteHandlerResponse<ApiCarResponse>;

  if (error) throw new Error(error.message);

  if (image && responseData?.id) {
    const hashedFile = await hashFile(image);

    const supabase = createClient();

    const { error: imageUploadError } = await supabase.storage
      .from('cars_images')
      .upload(`${responseData.id}/${hashedFile}`, image);

    if (imageUploadError)
      throw new Error(
        'Car added successfully, but image upload failed. You can edit and upload the image in your car details.',
        {
          cause: CAR_IMAGE_UPLOAD_ERROR_CAUSE,
        },
      );
  }

  return responseData;
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

export async function getProfileById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message || "Can't get user profile.");

  return data;
}

type PatchProfileParameters =
  | {
      property: Extract<keyof Profile, 'avatar_url'>;
      value: File | null | undefined;
    }
  | { property: Extract<keyof Profile, 'username'>; value: string | null };

export async function patchProfile({
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

export async function getCarsPage({ pageParam }: { pageParam: number }) {
  const rangeIndexFrom = pageParam * CARS_INFINITE_QUERY_PAGE_DATA_LIMIT;
  const rangeIndexTo =
    (pageParam + 1) * CARS_INFINITE_QUERY_PAGE_DATA_LIMIT - 1;

  const supabase = createClient();
  const { data, error } = await supabase
    .from('cars')
    .select()
    .order('created_at', { ascending: false })
    .limit(CARS_INFINITE_QUERY_PAGE_DATA_LIMIT)
    .range(rangeIndexFrom, rangeIndexTo);

  if (error) throw new Error(error.message);

  const hasMoreCars = !(data.length < CARS_INFINITE_QUERY_PAGE_DATA_LIMIT);

  return { data, nextPageParam: hasMoreCars ? pageParam + 1 : null };
}

export async function getCarById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('cars')
    .select()
    .eq('id', id)
    .limit(1);

  if (error) throw new Error(error.message);

  if (!data[0]) throw new Error("Can't get car.");

  return data[0];
}

export async function getCarOwnershipsByCarId(carId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('cars_ownerships')
    .select()
    .eq('car_id', carId);

  if (error) throw new Error(error.message);

  return data;
}

export async function deleteCarOwnershipsByOwnersIds(
  carId: string,
  ownersIds: string[],
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('cars_ownerships')
    .delete()
    .eq('car_id', carId)
    .in('owner_id', ownersIds)
    .select();

  if (error) throw new Error(error.message || "Can't delete car owner.");

  if (!data.length)
    throw new Error(
      'Something went wrong when deleting car ownership. Try Again.',
    );

  return data;
}

export async function postCarOwnership(carId: string, ownerId: string | null) {
  if (!ownerId) throw new Error('You must provide a new owner ID.');

  const supabase = createClient();

  const { data, error } = await supabase
    .from('cars_ownerships')
    .insert({ car_id: carId, owner_id: ownerId, is_primary_owner: false })
    .select()
    .single();

  if (error) throw new Error(error.message || "Can't add new car owner.");

  return data;
}

export async function patchCarPrimaryOwnership(
  newPrimaryOwnerId: string | null,
  carId: string,
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
