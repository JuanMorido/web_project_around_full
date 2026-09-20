import { useContext, useRef } from 'react';
import CurrentUserContext from '../../../../../contexts/CurrentUserContext';

export default function EditAvatar(): React.JSX.Element {
  const { handleUpdateAvatar } = useContext(CurrentUserContext);
  const avatarRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (avatarRef.current) {
      void handleUpdateAvatar({ avatar: avatarRef.current.value });
    }
  }

  return (
    <form
      className='popup__form'
      id='avatar-form'
      name='avatar-form'
      onSubmit={handleSubmit}
    >
      <label className='popup__field'>
        <input
          className='popup__input popup__input_type_url'
          id='avatar'
          name='avatar'
          placeholder='Enlace a la imagen'
          ref={avatarRef}
          required
          type='url'
        />
        <span className='popup__error' id='avatar-error'></span>
      </label>
      <button className='button popup__button' type='submit'>
        Guardar
      </button>
    </form>
  );
}
