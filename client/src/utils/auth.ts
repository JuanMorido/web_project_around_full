const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

type AuthUser = {
  _id: string;
  email: string;
  name: string;
  about: string;
  avatar: string;
};

type RegisterResponse = AuthUser;

type LoginResponse = AuthUser & {
  token: string;
};

async function request<T>(url: string, options: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || `Error: ${res.status}`);
  }

  return data as T;
}

export function register(
  email: string,
  password: string,
): Promise<RegisterResponse> {
  return request<RegisterResponse>(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
}

export function authorize(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return request<LoginResponse>(`${API_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
}
