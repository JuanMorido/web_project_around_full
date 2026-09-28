import type {
  ApiConfig,
  AvatarFormData,
  ProfileFormData,
  UserData,
} from '../interfaces/UserData';
import type { CardData, CardFormData } from '../interfaces/CardData';

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

  async getInitialCards(): Promise<CardData[]> {
    return await this._request<CardData[]>(`${this._baseUrl}/cards/`);
  }

  async updateUserInfo(data: ProfileFormData): Promise<UserData> {
    return await this._request<UserData>(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateAvatar(data: AvatarFormData): Promise<UserData> {
    return await this._request<UserData>(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async addCard(data: CardFormData): Promise<CardData> {
    return await this._request<CardData>(`${this._baseUrl}/cards/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteCard(id: string): Promise<CardData> {
    return await this._request<CardData>(`${this._baseUrl}/cards/${id}`, {
      method: 'DELETE',
    });
  }

  async addLike(id: string): Promise<CardData> {
    return await this._request<CardData>(`${this._baseUrl}/cards/${id}/likes`, {
      method: 'PUT',
    });
  }

  async removeLike(id: string): Promise<CardData> {
    return await this._request<CardData>(`${this._baseUrl}/cards/${id}/likes`, {
      method: 'DELETE',
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
