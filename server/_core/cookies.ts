import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-key');

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export async function getUserFromCookie(cookieHeader: string): Promise<User | null> {
  try {
    const cookies = parseCookies(cookieHeader);
    const token = cookies['session'];
    
    if (!token) return null;
    
    const verified = await jwtVerify(token, secret);
    return verified.payload as User;
  } catch (error) {
    return null;
  }
}

export function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  
  if (!cookieHeader) return cookies;
  
  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  
  return cookies;
}
