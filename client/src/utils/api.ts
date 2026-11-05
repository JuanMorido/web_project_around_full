import type { ApiConfig, ProfileFormData, UserData } from '../interfaces/UserData';

class Api {
  private _baseUrl: string;
  private _headers: Record<string, string>;

  constructor({ baseUrl, headers }: ApiConfig) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  private _getHeaders(): Record<string, string> {
    const token = localStorage.getItem('jwt');
    return {
      ...this._headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async _request<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...this._getHeaders(),
        ...options?.headers,
      },
    });
    if (res.ok) {
      return (await res.json()) as T;
    }
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || `Error: ${res.status}`);
  }

  async getUserInfo(): Promise<UserData> {
    return await this._request<UserData>(`${this._baseUrl}/users/me`);
  }

  async updateUserInfo(data: ProfileFormData): Promise<UserData> {
    return await this._request<UserData>(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

const api = new Api({
  baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
