type PopupProps = {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
  isConfirm?: boolean;
};

export default function Popup(props: PopupProps): React.JSX.Element {
  const { title, children, onClose, isOpen, isConfirm } = props;

  const contentClassName = [
    'popup__content',
    !title ? 'popup__content_content_image' : '',
    isConfirm ? 'popup__content_type_confirm' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`popup ${isOpen ? 'popup_is-opened' : ''}`}>
      <div className={contentClassName}>
        <button
          aria-label='Close modal'
          className='popup__close'
          type='button'
          onClick={onClose}
        />
        {title && <h3 className='popup__title'>{title}</h3>}
        {children}
      </div>
    </div>
  );
}
