import { useContext } from 'react';
import type { CardData } from '../../interfaces/CardData';
import type { ModalData } from '../../interfaces/ModalData';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import Popup from './components/popup/Popup';
import NewCard from './components/popup/NewCard/NewCard';
import EditProfile from './components/popup/EditProfile/EditProfile';
import EditAvatar from './components/popup/EditAvatar/EditAvatar';
import ImagePopup from './components/popup/ImagePopup/ImagePopup';
import RemoveCard from './components/popup/RemoveCard/RemoveCard';
import Card from './components/card/Card';

type MainProps = {
  cards: CardData[];
  popup: ModalData | null;
  handleOpenPopup: (popup: ModalData) => void;
  handleClosePopup: () => void;
  handleCardLike: (card: CardData) => void;
};

export default function Main(props: MainProps): React.JSX.Element {
  const { cards, popup, handleOpenPopup, handleClosePopup, handleCardLike } = props;
  const { currentUser } = useContext(CurrentUserContext);

  const newCardPopup: ModalData = { title: 'Nuevo lugar', children: <NewCard /> };
  const editProfilePopup: ModalData = { title: 'Editar perfil', children: <EditProfile /> };
  const editAvatarPopup: ModalData = {
    title: 'Cambiar foto de perfil',
    children: <EditAvatar />,
  };

  function handleCardImageClick(card: CardData): void {
    const imagePopup: ModalData = { children: <ImagePopup card={card} /> };
    handleOpenPopup(imagePopup);
  }

  function handleCardDeleteClick(card: CardData): void {
    const removeCardPopup: ModalData = {
      title: '¿Estás seguro/a?',
      children: <RemoveCard card={card} />,
      isConfirm: true,
    };
    handleOpenPopup(removeCardPopup);
  }

  return (
    <main className='content'>
      <section className='profile page__section'>
        <div className='profile__avatar-container'>
          <img
            className='profile__image'
            src={currentUser?.avatar}
            alt={currentUser?.name}
          />
          <button
            aria-label='Cambiar foto de perfil'
            className='profile__avatar-edit'
            type='button'
            onClick={() => handleOpenPopup(editAvatarPopup)}
          />
        </div>
        <div className='profile__info'>
          <h1 className='profile__title'>{currentUser?.name}</h1>
          <button
            aria-label='Editar perfil'
            className='profile__edit-button'
            type='button'
            onClick={() => handleOpenPopup(editProfilePopup)}
          />
          <p className='profile__description'>{currentUser?.about}</p>
        </div>
        <button
          aria-label='Agregar tarjeta'
          className='profile__add-button'
          type='button'
          onClick={() => handleOpenPopup(newCardPopup)}
        />
      </section>
      <section className='cards page__section'>
        <ul className='cards__list'>
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onImageClick={handleCardImageClick}
              handleCardLike={handleCardLike}
              handleCardDeleteClick={handleCardDeleteClick}
            />
          ))}
        </ul>
      </section>

      {popup && (
        <Popup
          onClose={handleClosePopup}
          title={popup.title}
          isOpen={popup !== null}
          isConfirm={popup.isConfirm}
        >
          {popup.children}
        </Popup>
      )}
    </main>
  );
}
