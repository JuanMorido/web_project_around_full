export interface UserData {
  _id: string;
  name: string;
  about: string;
  avatar: string;
}

export interface ProfileFormData {
  name: string;
  about: string;
}

export interface AvatarFormData {
  avatar: string;
}

export interface ApiConfig {
  baseUrl: string;
  headers: Record<string, string>;
}
