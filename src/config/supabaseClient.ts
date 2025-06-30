// src/supabase.ts
import { createServerClient, type CookieOptions, parse, serialize } from '@supabase/ssr';
import { type Request, type Response } from 'express';

export const createSupabaseClient = (req: Request, res: Response) => {
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const parsedCookies = parse(req.headers.cookie ?? '');
          return Object.entries(parsedCookies).map(([name, value]) => ({
            name,
            value: value ?? ''
          }));
        },
        setAll(cookiesToSet) {
          res.setHeader('Set-Cookie', cookiesToSet.map(cookie => serialize(cookie.name, cookie.value, cookie.options)));
        },
      },
    }
  );

  return supabase;
};
