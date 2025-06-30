import { type Request, type Response } from 'express';
import { supabase } from '../config/supabaseClient';

/**
 * @description Authenticate user and provide JWT tokens
 * @route POST /api/auth/login
 */
export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required.' });
        return
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            res.status(401).json({ message: error.message });
            return;
        }

        if (data.session) {
            res.status(200).json({ session: data.session });
            return;
        } else {
            res.status(401).json({ message: 'Invalid credentials.' });
            return;
        }
    } catch (error) {
        const e = error as Error;
        res.status(500).json({ message: 'Internal server error', error: e.message });
        return;
    }
}

/**
 * @description Validate a JWT token
 * @route GET /api/auth/validate
 */

/**
 * @description Validate a JWT and return user's role. To be called by other microservices.
 * @route GET /api/auth/validate
 */
export const validateToken = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ valid: false, message: 'Authorization header is missing or malformed.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ valid: false, message: 'Invalid or expired token.' });
      return;
    }

    // Determine the user's role.
    // If user is anonymous, their role is 'anonymous'.
    // Otherwise, check metadata. If no role in metadata, they are a basic 'authenticated' user.
    const role = user.is_anonymous ? 'anonymous' : user.user_metadata.role || 'authenticated';

    // Respond with valid status, the user object, and their role.
    res.status(200).json({
      valid: true,
      role: role,
      user: user,
    });

  } catch (error) {
    const e = error as Error;
    res.status(500).json({ valid: false, message: 'Internal server error', error: e.message });
  }
};




/**
 * @description Sign in an anonymous user
 * @route POST /api/auth/login/anonymous
 */
export async function signInAnonymously(req: Request, res: Response) {
    try {
        const { data, error } = await supabase.auth.signInAnonymously();

        if (error) {
            res.status(500).json({ message: error.message });
            return;
        }

        res.status(200).json({ session: data.session });
    } catch (error) {
        const e = error as Error;
        res.status(500).json({ message: 'Internal server error', error: e.message });
    }
}

/**
 * @description Refresh a session using a refresh token
 * @route POST /api/auth/refresh
 */
export async function refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token is required.' });
        return;
    }

    try {
        const { data, error } = await supabase.auth.refreshSession({
            refresh_token: refreshToken
        });

        if (error) {
            res.status(401).json({ message: 'Could not refresh session.', error: error.message });
            return;
        }

        if (data.session) {
            res.status(200).json({ session: data.session });
            return;
        } else {
            res.status(401).json({ message: 'Invalid refresh token.' });
            return;
        }

    } catch (error) {
        const e = error as Error;
        res.status(500).json({ message: 'Internal server error', error: e.message });
        return;
    }
}
