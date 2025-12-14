import { cookies } from 'next/headers';
import { users } from './data';

const SESSION_COOKIE_NAME = 'session_token';

export async function getSession() {
  const cookieStore = cookies();
  const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!userId) {
    return null;
  }

  const user = users.find(u => u.id === userId);

  if (!user) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
