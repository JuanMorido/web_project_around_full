import type { ProfileFormData, UserData } from './UserData';

export interface CurrentUserContextType {
  currentUser: UserData | null;
  handleUpdateUser: (data: ProfileFormData) => Promise<void>;
}
