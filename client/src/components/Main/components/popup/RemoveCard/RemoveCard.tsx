import { useContext } from 'react';
import CurrentUserContext from '../../../../../contexts/CurrentUserContext';
import type { CardData } from '../../../../../interfaces/CardData';

type RemoveCardProps = {
  card: CardData;
};

export default function RemoveCard(props: RemoveCardProps): React.JSX.Element {
  const { card } = props;
  const { handleCardDelete } = useContext(CurrentUserContext);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void handleCardDelete(card);
  }

  return (
    <form className='popup__form' name='remove-card-form' onSubmit={handleSubmit}>
      <button className='button popup__button' type='submit'>
        Sí
      </button>
    </form>
  );
}
