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

  private async _request<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, options);
    if (res.ok) {
      return (await res.json()) as T;
    }
    throw new Error(`Error: ${res.status}`);
  }

  async getUserInfo(): Promise<UserData> {
    return await this._request<UserData>(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    });
  }

  async getInitialCards(): Promise<CardData[]> {
    return await this._request<CardData[]>(`${this._baseUrl}/cards/`, {
      headers: this._headers,
    });
  }

  async updateUserInfo(data: ProfileFormData): Promise<UserData> {
    return await this._request<UserData>(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(data),
    });
  }

  async updateAvatar(data: AvatarFormData): Promise<UserData> {
    return await this._request<UserData>(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(data),
    });
  }

  async addCard(data: CardFormData): Promise<CardData> {
    return await this._request<CardData>(`${this._baseUrl}/cards/`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(data),
    });
  }

  async deleteCard(id: string): Promise<{ message: string }> {
    return await this._request<{ message: string }>(
      `${this._baseUrl}/cards/${id}`,
      {
        method: 'DELETE',
        headers: this._headers,
      },
    );
  }

  async addLike(id: string): Promise<CardData> {
    return await this._request<CardData>(`${this._baseUrl}/cards/${id}/likes`, {
      method: 'PUT',
      headers: this._headers,
    });
  }

  async removeLike(id: string): Promise<CardData> {
    return await this._request<CardData>(`${this._baseUrl}/cards/${id}/likes`, {
      method: 'DELETE',
      headers: this._headers,
    });
  }
}

const api = new Api({
  baseUrl: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
