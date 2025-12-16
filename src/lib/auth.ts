
import { cookies } from 'next/headers';
import { getUserById } from './data';
import type { User } from './types';

const SESSION_COOKIE_NAME = 'session_token';

export async function getSession(): Promise<(Omit<User, 'password'>) | null> {
  const cookieStore = cookies();
  const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!userId) {
    return null;
  }

  const user = await getUserById(userId);

  if (!user) {
    // This could happen if the user was deleted but the cookie remains.
    // We cannot delete the cookie here as it's not a Server Action/Route Handler.
    // The user will simply be treated as logged out.
    return null;
  }

  // The password should already be omitted by getUserById
  return user;
}
