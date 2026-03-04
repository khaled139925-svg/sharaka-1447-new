import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { getUserFromCookie } from './cookies';

export async function createContext(opts?: FetchCreateContextFnOptions) {
  const user = await getUserFromCookie(opts?.req?.headers.get('cookie') || '');
  
  return {
    user,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
