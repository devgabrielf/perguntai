import { Button } from "../Button";

import deleteImg from '../../assets/images/delete.svg';
import logoutImg from '../../assets/images/logout-black.svg';

import './styles.scss';

type ModalProps = {
    object: string;
    onConfirm: () => Promise<void>;
    onClose: () => void;
}

export function Modal({ object, onConfirm, onClose }: ModalProps) {
    const logout = object === 'logout' ? true : false;
    
    return (
        <div className="modal" onClick={onClose}>
            <div className="container" onClick={event => event.stopPropagation()}>
                {!logout &&
                    <>
                        <img src={deleteImg} alt="Excluir" />
                        <h2>
                            Excluir {object}
                        </h2>
                        <p>Tem certeza que deseja excluir esta {object}?</p>
                    </>
                }
                {logout &&
                    <>
                        <img src={logoutImg} alt="Sair" />
                        <h2>
                            Sair da conta
                        </h2>
                        <p>Tem certeza que deseja sair da sua conta?</p>
                    </>
                }
                <div className="buttons">
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button onClick={onConfirm}>
                    {!logout &&
                        'Sim, excluir'
                    }
                    {logout &&
                        'Sim, sair'
                    }
                    </Button>
                </div>
            </div>
        </div>
    );
}