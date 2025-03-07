import { Provider } from '@supabase/supabase-js';
import { Route } from 'next';

import { apiCarPostResponse } from '@/app/api/car/route';
import { AddCarFormValues } from '@/components/ui/AddCarForm/AddCarForm';
import { Car, CarsInfiniteQueryData, RouteHandlerResponse } from '@/types';

import { hashFile, mutateEmptyFieldsToNull } from '../general';
import { createClient } from './client';

export const CAR_IMAGE_UPLOAD_ERROR_CAUSE = 'image upload error';
export const CARS_INFINITE_QUERY_PAGE_DATA_LIMIT = 15;

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

export const fetchUserProfile = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id || '');

  return profileData?.[0];
};

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

export async function postNewCar(formData: AddCarFormValues) {
  const supabase = createClient();

  const { image, ...data } = formData;

  mutateEmptyFieldsToNull(data);

  const jsonDataToValidate = JSON.stringify(data);

  const url = new URL(window.location.origin);
  url.pathname = '/api/car' satisfies Route;

  let newCarResponse: Response | null = null;
  try {
    newCarResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonDataToValidate,
    });
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }

  const { data: responseData, error } =
    (await newCarResponse?.json()) as RouteHandlerResponse<apiCarPostResponse>;

  if (error) throw new Error(error.message);

  if (image && responseData?.id) {
    const hashedFile = await hashFile(image);

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

export async function fetchCars({ pageParam }: { pageParam: number }) {
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

export function addCarToInfiniteQueryData(
  newCar: Car,
  queryData: CarsInfiniteQueryData,
  pageIndex: number = 0,
) {
  const currentPage = queryData.pages[pageIndex];
  const nextPage = queryData?.pages[pageIndex + 1];

  currentPage.data = [{ ...newCar }, ...currentPage.data];

  if (currentPage.data.length > CARS_INFINITE_QUERY_PAGE_DATA_LIMIT) {
    const carriedCar = currentPage.data.pop();

    if (!nextPage && carriedCar) {
      queryData.pages.push({
        data: [{ ...carriedCar }],
        nextPageParam: pageIndex + 2,
      });
      queryData.pageParams.push(pageIndex + 1);
      currentPage.nextPageParam = pageIndex + 1;
    } else if (nextPage && carriedCar) {
      return addCarToInfiniteQueryData(
        { ...carriedCar },
        queryData,
        pageIndex + 1,
      );
    }
  }

  return;
}
