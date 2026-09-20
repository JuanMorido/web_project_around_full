const BASE_URL = 'https://se-register-api.en.tripleten-services.com/v1';

type AuthUser = {
  _id: string;
  email: string;
};

type RegisterResponse = {
  data: AuthUser;
};

type LoginResponse = {
  token: string;
};

type TokenResponse = {
  data: AuthUser;
};

async function request<T>(url: string, options: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || data?.message || `Error: ${res.status}`);
  }

  return data as T;
}

export function register(
  email: string,
  password: string,
): Promise<RegisterResponse> {
  return request<RegisterResponse>(`${BASE_URL}/signup`, {
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
  return request<LoginResponse>(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
}

export function checkToken(token: string): Promise<TokenResponse> {
  return request<TokenResponse>(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}
