import type { AvatarFormData, ProfileFormData, UserData } from './UserData';
import type { CardData, CardFormData } from './CardData';

export interface CurrentUserContextType {
  currentUser: UserData | null;
  handleUpdateUser: (data: ProfileFormData) => Promise<void>;
  handleUpdateAvatar: (data: AvatarFormData) => Promise<void>;
  handleAddPlaceSubmit: (data: CardFormData) => Promise<void>;
  handleCardDelete: (card: CardData) => Promise<void>;
}
