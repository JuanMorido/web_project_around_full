import { useContext } from 'react';
import type { CardData } from '../../../../interfaces/CardData';
import CurrentUserContext from '../../../../contexts/CurrentUserContext';

type CardProps = {
  card: CardData;
  onImageClick: (card: CardData) => void;
  handleCardLike: (card: CardData) => void;
  handleCardDeleteClick: (card: CardData) => void;
};

export default function Card(props: CardProps): React.JSX.Element {
  const { card, onImageClick, handleCardLike, handleCardDeleteClick } = props;
  const { currentUser } = useContext(CurrentUserContext);
  const { name, link, isLiked, owner } = card;
  const isOwn = owner === currentUser?._id;

  const cardLikeButtonClassName = `card__like-button ${
    isLiked ? 'card__like-button_active' : ''
  }`;

  return (
    <li className='card'>
      <img
        className='card__image'
        src={link}
        alt={name}
        onClick={() => onImageClick(card)}
      />
      {isOwn && (
        <button
          aria-label='Delete card'
          className='card__delete-button'
          type='button'
          onClick={() => handleCardDeleteClick(card)}
        />
      )}
      <div className='card__description'>
        <h2 className='card__title'>{name}</h2>
        <button
          aria-label='Like card'
          type='button'
          className={cardLikeButtonClassName}
          onClick={() => handleCardLike(card)}
        />
      </div>
    </li>
  );
}
