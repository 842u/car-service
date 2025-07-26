export const allowedOrigins = {
  github: {
    avatars: new URL('https://avatars.githubusercontent.com'),
  },
  google: {
    avatars: new URL('https://lh3.googleusercontent.com'),
  },
  supabase: {
    app: new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}`),
    auth: new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/`),
    rest: new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`),
    storage: new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/`),
  },
};
