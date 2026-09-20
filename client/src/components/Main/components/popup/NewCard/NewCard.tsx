import { useContext, useState } from 'react';
import CurrentUserContext from '../../../../../contexts/CurrentUserContext';

export default function NewCard(): React.JSX.Element {
  const { handleAddPlaceSubmit } = useContext(CurrentUserContext);
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void handleAddPlaceSubmit({ name, link });
  }

  return (
    <form
      className='popup__form'
      id='new-card-form'
      name='new-card-form'
      onSubmit={handleSubmit}
    >
      <label className='popup__field'>
        <input
          id='card-name'
          className='popup__input popup__input_type_card-name'
          name='name'
          placeholder='Título'
          minLength={2}
          maxLength={30}
          required
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <span className='popup__error' id='card-name-error'></span>
      </label>
      <label className='popup__field'>
        <input
          id='card-url'
          className='popup__input popup__input_type_url'
          name='link'
          placeholder='Enlace a la imagen'
          required
          type='url'
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <span className='popup__error' id='card-url-error'></span>
      </label>
      <button className='button popup__button' type='submit'>
        Crear
      </button>
    </form>
  );
}
