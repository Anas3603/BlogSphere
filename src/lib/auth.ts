
import { cookies } from 'next/headers';
import { getUserById } from './data';
import type { User } from './types';

const SESSION_COOKIE_NAME = 'session_token';

export async function getSession(): Promise<(Omit<User, 'password'> & {id: string}) | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!userId) {
    return null;
  }

  const user = await getUserById(userId);

  if (!user) {
    // This could happen if the user was deleted but the cookie remains.
    // The user will simply be treated as logged out.
    return null;
  }

  // The password should already be omitted by getUserById
  return user;
}
