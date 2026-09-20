import { useContext, useState } from 'react';
import CurrentUserContext from '../../../../../contexts/CurrentUserContext';

export default function EditProfile(): React.JSX.Element {
  const { currentUser, handleUpdateUser } = useContext(CurrentUserContext);
  const [name, setName] = useState(currentUser?.name || '');
  const [description, setDescription] = useState(currentUser?.about || '');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void handleUpdateUser({ name, about: description });
  }

  return (
    <form
      className='popup__form'
      id='edit-profile-form'
      name='edit-profile-form'
      onSubmit={handleSubmit}
    >
      <label className='popup__field'>
        <input
          className='popup__input popup__input_type_name'
          id='name'
          minLength={2}
          maxLength={40}
          name='name'
          placeholder='Nombre'
          required
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <span className='popup__error' id='name-error'></span>
      </label>
      <label className='popup__field'>
        <input
          className='popup__input popup__input_type_description'
          id='about'
          minLength={2}
          maxLength={200}
          name='about'
          placeholder='Acerca de mí'
          required
          type='text'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <span className='popup__error' id='about-error'></span>
      </label>
      <button className='button popup__button' type='submit'>
        Guardar
      </button>
    </form>
  );
}
