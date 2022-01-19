import copyImg from '../../assets/images/copy.svg';

import { toastSuccess } from '../../assets/toasts';

import './styles.scss';

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps) {
    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(props.code);
        toastSuccess('Código copiado');
    }

    return (
        <button className="room-code" onClick={copyRoomCodeToClipboard} title="Copiar código">
            <div>
                <img src={copyImg} alt="Copy room code" />
            </div>
            <span>Sala #{props.code}</span>
        </button>
    );
}