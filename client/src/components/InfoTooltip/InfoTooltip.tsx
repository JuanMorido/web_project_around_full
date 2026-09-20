import Popup from '../Main/components/popup/Popup';
import successIcon from '../../images/tooltip-success.svg';
import failIcon from '../../images/tooltip-fail.svg';

type InfoTooltipProps = {
  isOpen: boolean;
  isSuccess: boolean;
  onClose: () => void;
};

export default function InfoTooltip(
  props: InfoTooltipProps,
): React.JSX.Element {
  const { isOpen, isSuccess, onClose } = props;
  const message = isSuccess
    ? '¡Correcto! Ya estás registrado.'
    : 'Uy, algo salió mal. Por favor, inténtalo de nuevo.';

  return (
    <Popup isOpen={isOpen} onClose={onClose} isTooltip>
      <img
        className='popup__tooltip-icon'
        src={isSuccess ? successIcon : failIcon}
        alt={isSuccess ? 'Registro exitoso' : 'Error de autenticación'}
      />
      <p className='popup__tooltip-message'>{message}</p>
    </Popup>
  );
}
